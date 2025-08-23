
import {  PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../../../backend/src/middleware/middleware";



export const cartRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
    },
    Variables: {
        userId: string
    }
}>();

cartRouter.post('/add', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const body = await c.req.json();
  const { productId, quantity } = body;

  if (!productId || !quantity || quantity <= 0) {
    c.status(400);
    return c.json({ message: "Product ID and valid quantity are required." });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    c.status(404);
    return c.json({ message: "Product not found." });
  }

  if (product.quantity < quantity) {
    c.status(400);
    return c.json({ message: "Insufficient product stock." });
  }

  const existing = await prisma.cart.findFirst({
    where: { userId, productId },
  });

  let cartItem;

  if (existing) {
    const totalQuantity = existing.quantity + quantity;

    if (product.quantity < totalQuantity) {
      c.status(400);
      return c.json({ message: "Not enough stock to increase quantity." });
    }

    cartItem = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: totalQuantity },
    });
  } else {
    cartItem = await prisma.cart.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
  }

  return c.json({ message: "Product added to cart."});
});

cartRouter.post('/minus', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const body = await c.req.json();
  const { itemId, quantity } = body;

  if (!itemId || !quantity || quantity <= 0) {
    c.status(400);
    return c.json({ message: "Product ID and valid quantity are required." });
  }

  const product = await prisma.cart.findUnique({ where: { id: itemId } });

  if (!product) {
    c.status(404);
    return c.json({ message: "Product not found in the cart." });
  }

  if (product.quantity < quantity) {
    await prisma.cart.delete({ where: { id: itemId } });
    return c.json({ message: "Product deleted successfully." });
  }

  const existing = await prisma.cart.findFirst({
    where: { userId, id :itemId },
  });

  let cartItem;

  if (existing) {
    const totalQuantity = existing.quantity - quantity;

    if (totalQuantity === 0) {
      await prisma.cart.delete({ where: { id: itemId } });
      return c.json({ message: "Product deleted successfully." });
    }

    cartItem = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: totalQuantity },
    });
  } 

  return c.json({ message: "Product deleted from cart."});
});

cartRouter.delete('/delete/:id', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');
  const cartItemId = c.req.param('id');

  const cartItem = await prisma.cart.findUnique({ where: { id: cartItemId } });

  if (!cartItem || cartItem.userId !== userId) {
    c.status(404);
    return c.json({ error: "Cart item not found or unauthorized." });
  }

  await prisma.cart.delete({ where: { id: cartItemId } });

  return c.json({ message: "Item removed from cart." });
});


cartRouter.get('/my', authMiddleware, async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get('userId');

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      product: true, // Include product details
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const sortedItems = cartItems.map(item => ({
    id : item.id,
    name : item.product.name,
    quantity : item.quantity,
    inStock : item.product.quantity > item.quantity ? true: false,
    price : item.product.price,
    originalPrice : item.product.originalPrice,
    image : item.product.main,
    productId: item.product.id
  }))

  let subTotal = sortedItems.reduce((sum, item) => sum + item.quantity, 0);
  let subTotalPrice = sortedItems.reduce((money, item) => money + (item.price * item.quantity), 0);
  
  // true if at least one item has inStock === false
  const hasOutOfStock = sortedItems.some(i => !i.inStock);

  const finalMap = {
    subTotal ,
    subTotalPrice ,
    items: sortedItems,
    hasOutOfStock 
  }

  return c.json(finalMap);
});
