
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../../../backend/src/middleware/middleware";
import { deliveryAddressSchema, orderBuySchema } from "@yashxdev/diwalilux-common";
import { sendOrderConfirmationEmail } from "./user"
// import crypto from "crypto-js";
import crypto from "crypto";



export const orderRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    RAZORPAY_KEY_ID: string;
    RAZORPAY_KEY_SECRET: string;
    FRONTEND_BASE_URL: string;
    RAZORPAY_WEBHOOK_SECRET: string;
  },
  Variables: {
    userId: string
  }
}>();

// orderRouter.post("/request", authMiddleware, async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env?.DATABASE_URL,
//   }).$extends(withAccelerate());

//   try {
//     const userId = c.get("userId");
//     const body = await c.req.json();

//     const parsedBody = orderBuySchema.safeParse(body);

//     if (!parsedBody.success) {
//       c.status(400);
//       return c.json({
//         message: "Invalid inputs",
//         errors: parsedBody.error.flatten(),
//       });
//     }

//     const { items, totalAmount, delivery , status } =
//       parsedBody.data;

//     // ✅ Use transaction for atomicity
//     const result = await prisma.$transaction(async (tx) => {
//       // 1. Create Order + OrderItems
//       const order = await tx.order.create({
//         data: {
//           userId,
//           totalAmount,
//           items: {
//             create: items.map((item) => ({
//               productId: item.productId,
//               quantity: item.quantity,
//               price: item.price,
//             })),
//           },
//           delivery : {
//             create: { ...delivery }
//           }
//         },
//         include: { items: true, delivery: true },
//       });

//       // 2. Delete cart items
//       const cartIds = items.map((item) => item.cartId);
//       if (cartIds.length > 0) {
//         await tx.cart.deleteMany({
//           where: {
//             id: { in: cartIds },
//             userId: userId,
//           },
//         });
//       }

//       // // 3. Update product stock
//       // for (const item of items) {
//       //   await tx.product.update({
//       //     where: { id: item.productId },
//       //     data: {
//       //       quantity: {
//       //         decrement: item.quantity, // decrease stock
//       //       },
//       //     },
//       //   });
//       // }

//       // 2️⃣ Create Razorpay Payment Link
//       const key_id = c.env.RAZORPAY_KEY_ID;
//       const key_secret = c.env.RAZORPAY_KEY_SECRET;

//       console.log("here 1");

//       const res = await fetch("https://api.razorpay.com/v1/payment_links", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Basic " + btoa(`${key_id}:${key_secret}`),
//         },
//         body: JSON.stringify({
//           amount: totalAmount * 100, // convert to paise
//           currency: "INR",
//           description: `Payment for Order #${order.id}`,
//           customer: {
//             name : delivery.fullName,
//             contact: delivery.phoneNo,
//           },
//           notify: {
//             sms: true,
//             email: false,
//           },
//           callback_url: `${c.env.BASE_URL}/api/v1/order/verify-payment`, // We'll create this next
//           callback_method: "POST",
//         }),
//       });

//       console.log("here 2");

//       const data: any = await res.json();

//       console.log(data)

//       if (!res.ok) {
//         return c.json({ success: false, message: data.error.description }, 400);
//       }
//       console.log("here 3");

//       // 3️⃣ Store payment link details in DB
//       await tx.order.update({
//         where: { id: order.id },
//         data: {
//           razorpayLinkId: data.id,
//           razorpayLink: data.short_url,
//         },
//       });

//       console.log("here 4");
//       return c.json({
//         success: true,
//         paymentLink: data.short_url,
//         orderId: order.id,
//       });
//     });

//     return c.json({
//       message: "Order created successfully.",
//       order: result,
//     });
//   } catch (err) {
//     console.error("Order creation error:", err);
//     c.status(500);
//     return c.json({ message: "Something went wrong while creating the order." });
//   } finally {
//     await prisma.$disconnect();
//   }
// });


orderRouter.post("/request", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const body = await c.req.json();

    const parsedBody = orderBuySchema.safeParse(body);
    if (!parsedBody.success) {
      c.status(400);
      return c.json({
        message: "Invalid inputs",
        errors: parsedBody.error.flatten(),
      });
    }

    const { items, totalAmount, delivery } = parsedBody.data;
    const key_id = c.env.RAZORPAY_KEY_ID;
    const key_secret = c.env.RAZORPAY_KEY_SECRET;

    // ✅ Transaction for DB write
    const order = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
          delivery: {
            create: { ...delivery },
          },
        },
        include: { items: true, delivery: true },
      });

      const cartIds = items.map((item) => item.cartId);
      if (cartIds.length > 0) {
        await tx.cart.deleteMany({
          where: { id: { in: cartIds }, userId },
        });
      }

      return order;
    });

    // ✅ Call Razorpay after DB commit
    const res = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${key_id}:${key_secret}`),
      },
      body: JSON.stringify({
        amount: totalAmount * 100,
        currency: "INR",
        description: `Payment for Order #${order.id}`,
        reference_id: order.id,
        customer: {
          name: delivery.fullName,
          contact: delivery.phoneNo,
        },
        notify: { sms: true, email: false },
        callback_url: `${c.env.FRONTEND_BASE_URL}/orders`,
        // callback_method: "POST", // ✅ lowercase
      }),
    });

    const data: any = await res.json();
    if (!res.ok) {
      console.error("Razorpay error:", data);
      c.status(400);
      return c.json({ success: false, message: data.error?.description || "Razorpay error" });
    }

    // ✅ Update order with Razorpay link
    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayLinkId: data.id,
        razorpayLink: data.short_url,
      },
    });

    return c.json({
      success: true,
      message: "Order created successfully",
      paymentLink: data.short_url,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    c.status(500);
    return c.json({ message: "Something went wrong while creating the order." });
  } finally {
    await prisma.$disconnect();
  }
});


orderRouter.get("/my", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");

    // ✅ Fetch orders with items + product details
    const orders = await prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: true // so we can access product image, name, etc.
          },
        },
        delivery: true
      },
      orderBy: { createdAt: "desc" },
    });


    // ✅ Format response
    const final = orders.map((order) => {
      const isToday =
        order.createdAt.toDateString() === new Date().toDateString();
      const displayDate = isToday
        ? "Today"
        : order.createdAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short", // "Aug"
          year: "numeric",
        });
      const isDeliver = order.status === 'DELIVERED'
      const isApplicableForCancel = order.status === 'PAID'


      return {
        id: order.id,
        date: displayDate,
        status: order.status,
        isDeliver: isDeliver,
        isApplicableForCancel: isApplicableForCancel,
        totalAmount: order.totalAmount,
        address: order.delivery?.Address,
        pincode: order.delivery?.pincode,
        district: order.delivery?.district,
        state: order.delivery?.state,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          image: item.product.main, // assuming `product.main` is your main image field
          name: item.product.name,
        })),
      };
    });

    return c.json({
      message: "Orders fetched successfully",
      orders: final,
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    c.status(500);
    return c.json({ message: "Something went wrong while fetching orders." });
  } finally {
    await prisma.$disconnect();
  }
});


orderRouter.get("/:orderId", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const orderId = c.req.param('orderId');

    // ✅ Fetch orders with items + product details
    const orders = await prisma.order.findMany({
      where: { userId: userId, id: orderId },
      include: {
        items: {
          include: {
            product: true, // so we can access product image, name, etc.
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });


    // ✅ Format response
    const final = orders.map((order) => {
      const isToday =
        order.createdAt.toDateString() === new Date().toDateString();
      const displayDate = isToday
        ? "Today"
        : order.createdAt.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short", // "Aug"
          year: "numeric",
        });
      const isDeliver = order.status === 'DELIVERED'
      const isApplicableForCancel = order.status === 'PAID'

      return {
        id: order.id,
        date: displayDate,
        status: order.status,
        isDeliver: isDeliver,
        isApplicableForCancel: isApplicableForCancel,
        totalAmount: order.totalAmount,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          image: item.product.main, // assuming `product.main` is your main image field
          name: item.product.name,
        })),
      };
    });

    return c.json({
      message: "Orders fetched successfully",
      orders: final,
    });
  } catch (err) {
    console.error("Orders fetch error:", err);
    c.status(500);
    return c.json({ message: "Something went wrong while fetching orders." });
  } finally {
    await prisma.$disconnect();
  }
});



orderRouter.post("/cancel/:id", authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userId = c.get("userId");
    const orderId = c.req.param("id");

    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the order with items
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      console.log(order);

      if (!order) {
        throw new Error("NOT_FOUND");
      }

      if (order.userId !== userId) {
        throw new Error("FORBIDDEN");
      }

      if (order.status === "CANCELLED") {
        throw new Error("ALREADY_CANCELLED");
      }

      if (order.status !== "PAID") {
        throw new Error("NOT_PAID");
      }

      // 2. Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }

      // 3. Update order status
      return tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
        include: { items: true },
      });
    });

    return c.json({
      message: "Order cancelled successfully",
      order: result,
    });
  } catch (err: any) {
    console.error("Cancel order error:", err);

    // map custom error codes to HTTP status
    switch (err.message) {
      case "NOT_FOUND":
        c.status(404);
        return c.json({ message: "Order not found" });
      case "FORBIDDEN":
        c.status(403);
        return c.json({ message: "Not authorized to cancel this order" });
      case "ALREADY_CANCELLED":
        c.status(400);
        return c.json({ message: "Order is already cancelled" });
      case "NOT_PAID":
        c.status(400);
        return c.json({ message: "Only PAID orders can be cancelled" });
      default:
        c.status(500);
        return c.json({ message: "Something went wrong" });
    }
  } finally {
    await prisma.$disconnect();
  }
});



orderRouter.post("/webhook/verify-payment", async (c) => {
  try {
    // 1️⃣ Get raw body (important for signature check)
    const rawBody = await c.req.text();
    const signature = c.req.header("X-Razorpay-Signature");

    // 2️⃣ Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", c.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid webhook signature");
      return c.json({ success: false, message: "Invalid signature" }, 400);
    }

    // 3️⃣ Parse event payload
    const event = JSON.parse(rawBody);
    console.log("✅ Webhook event:", event.event);

    if (event.event === "payment_link.paid") {

      const paymentLinkId = event.payload.payment_link.entity.id;
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment_link.entity.reference_id;

      const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
      }).$extends(withAccelerate());

      const order = await prisma.order.update({
        where: { id: orderId, razorpayLinkId: paymentLinkId },
        data: {
          status: "PAID",
          razorpayPaymentId: paymentId,
        },
      });

      const user = await prisma.user.findUnique({ where: { id: order.userId } })
      if (user)
        await sendOrderConfirmationEmail(user.email, orderId)


      // 3. Update product stock
      const orderUpdated = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!orderUpdated) {
        c.status(404);
        return c.json({ error: "Order not found" });
      }

      const items = orderUpdated.items;
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity, // decrease stock
            },
          },
        });
      }

      console.log(`✅ Order updated: ${paymentLinkId} marked as PAID`);
    }

    return c.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
});


orderRouter.post("/payment/:orderId", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // ✅ Call Razorpay after DB commit
  try {
    const orderId = c.req.param("orderId");
    const key_id = c.env.RAZORPAY_KEY_ID;
    const key_secret = c.env.RAZORPAY_KEY_SECRET;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })
    if (!order) {
      c.status(404);
      return c.json({ error: "Order not found" });
    }
    const totalAmount = order.totalAmount;

    const delivery = await prisma.deliveryAddress.findUnique({
      where: { orderId: orderId }
    });

    if (!delivery) {
      c.status(404);
      return c.json({ error: "Address not found" });
    }

    const res = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${key_id}:${key_secret}`),
      },
      body: JSON.stringify({
        amount: totalAmount * 100,
        currency: "INR",
        description: `Payment for Order #${order.id}`,
        reference_id: order.id,
        customer: {
          name: delivery.fullName,
          contact: delivery.phoneNo,
        },
        notify: { sms: true, email: false },
        callback_url: `${c.env.FRONTEND_BASE_URL}/orders`,
      }),
    });

    const data: any = await res.json();
    if (!res.ok) {
      console.error("Razorpay error:", data);
      c.status(400);
      return c.json({ success: false, message: data.error?.description || "Razorpay error" });
    }

    // ✅ Update order with Razorpay link
    await prisma.order.update({
      where: { id: order.id },
      data: {
        razorpayLinkId: data.id,
        razorpayLink: data.short_url,
      },
    });

    return c.json({
      success: true,
      message: "Payment Link generated",
      paymentLink: data.short_url,
      orderId: order.id,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    c.status(500);
    return c.json({ message: "Something went wrong while creating the order." });
  }
})