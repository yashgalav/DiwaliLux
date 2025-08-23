
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../../../backend/src/middleware/middleware";
import { orderBuySchema } from "@yashxdev/diwalilux-common";



export const orderRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  },
  Variables: {
    userId: string
  }
}>();

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

    const { items, totalAmount, name, phoneNo, address, status } =
      parsedBody.data;

    // ✅ Use transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Order + OrderItems
      const order = await tx.order.create({
        data: {
          userId,
          totalAmount,
          name,
          phoneNo,
          Address: address,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Delete cart items
      const cartIds = items.map((item) => item.cartId);
      if (cartIds.length > 0) {
        await tx.cart.deleteMany({
          where: {
            id: { in: cartIds },
            userId: userId,
          },
        });
      }

      // 3. Update product stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity, // decrease stock
            },
          },
        });
      }

      return order;
    });

    return c.json({
      message: "Order created successfully.",
      order: result,
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
    console.log(userId);


    // ✅ Fetch orders with items + product details
    const orders = await prisma.order.findMany({
      where: { userId: userId },
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
        date: displayDate ,
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

