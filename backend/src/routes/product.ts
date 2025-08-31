import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { authMiddleware } from "../../../backend/src/middleware/middleware";
import { createProduct } from "@yashxdev/diwalilux-common";
import { encodeBase64 } from "hono/utils/encode";
import ImageKit from "imagekit";
import { json } from "stream/consumers";
import { url } from "inspector";
import { randomInt } from "crypto";


export const productRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    PRIVATE_KEY: string;
    PUBLIC_KEY: string;
    IMAGEKIT_URL: string;
  },
  Variables: {
    userId: string
  }
}>();






productRouter.post('/admin/create', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // Check admin
  const isAdmin = await prisma.user.findUnique({
    where: { id: userId, isAdmin: true },
  });

  if (!isAdmin) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const data = await c.req.formData();

  const parsedInput = {
    productName: data.get('productName')?.toString() || "",
    description: data.get('description')?.toString() || "",
    price: Number(data.get('price')),
    originalPrice: Number(data.get('originalPrice')),
    main: data.get('main'),
    left: data.get('left'),
    top: data.get('top'),
    point1: data.get('point1')?.toString() || "",
    point2: data.get('point2')?.toString() || "",
    point3: data.get('point3')?.toString() || "",
    quantity: Number(data.get('quantity'))
  };

  const { success, error } = createProduct.safeParse(parsedInput);
  if (!success) {
    c.status(411);
    return c.json({ message: "Input not correct!", error: error.issues });
  }

  // ✅ Step 1: Check if product with the same name exists
  const existing = await prisma.product.findUnique({
    where: { name: parsedInput.productName },
  });

  if (existing) {
    c.status(409); // Conflict
    return c.json({ error: "Product with this name already exists." });
  }

  try {
    // ✅ Step 2: Upload images only after validation
    const [main, left,  top] = [
      parsedInput.main,
      parsedInput.left,
      parsedInput.top,
    ] as File[];

    const [mainUpload, leftUpload, topUpload] = await Promise.all([
      uploadToImageKit(main, c.env.PRIVATE_KEY),
      uploadToImageKit(left, c.env.PRIVATE_KEY),
      uploadToImageKit(top, c.env.PRIVATE_KEY),
    ]);

    // ✅ Step 3: Save product
    await prisma.product.create({
      data: {
        name: parsedInput.productName,
        description: parsedInput.description,
        price: parsedInput.price,
        originalPrice: parsedInput.originalPrice,
        point1: parsedInput.point1,
        point2: parsedInput.point2,
        point3: parsedInput.point3,
        main: mainUpload.url,
        left: leftUpload.url,
        top: topUpload.url,
        mainFileId: mainUpload.fileId,
        topFileId: topUpload.fileId,
        leftFileId: leftUpload.fileId,
        quantity: parsedInput.quantity
      },
    });

    return c.json({
      message: "Product created successfully.",
    });
  } catch (err: any) {
    console.error("Error:", err);
    c.status(500);
    return c.json({ error: "Something went wrong." });
  }
});



async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

type ImageKitUploadResponse = {
  fileId: string;
  url: string;
  name: string;
  filePath: string;
  size: number;
  height?: number;
  width?: number;
  thumbnailUrl?: string;
};


async function uploadToImageKit(file: File, imageKitPrivateKey: string): Promise<ImageKitUploadResponse> {
  const base64 = await fileToBase64(file);
  const formData = new FormData();
  formData.append("file", `data:${file.type};base64,${base64}`);
  formData.append("fileName", file.name);

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Basic " + btoa(imageKitPrivateKey + ":"),
    },
  });


  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json() as ImageKitUploadResponse;;

  return data; // returns { url, fileId, ... }
}



productRouter.delete('/admin/delete/:id', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  // Check admin
  const isAdmin = await prisma.user.findUnique({
    where: { id: userId, isAdmin: true }
  });

  if (!isAdmin) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  const productId = c.req.param('id');

  // Find the product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    c.status(404);
    return c.json({ message: "Product not found" });
  }

  // Optional: Delete images from ImageKit (only if you store fileIds)
  await deleteFromImageKit(product.mainFileId, c.env.PRIVATE_KEY);
  await deleteFromImageKit(product.topFileId, c.env.PRIVATE_KEY);
  await deleteFromImageKit(product.leftFileId, c.env.PRIVATE_KEY);

  await prisma.product.delete({
    where: { id: productId },
  });

  return c.json({ message: "Product deleted successfully." });
});


async function deleteFromImageKit(fileId: string, privateKey: string) {
  const response = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: "Basic " + btoa(privateKey + ":"),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete image from ImageKit: " + await response.text());
  }
}


productRouter.get('/products/all', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const page = parseInt(c.req.query('page') || '1', 10);
  const limit = parseInt(c.req.query('limit') || '10', 10);
  const search = c.req.query('search')?.toLowerCase() || '';

  const skip = (page - 1) * limit;

  const whereClause: Prisma.productWhereInput | undefined = search
    ? {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    }
    : undefined;

  try {
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit
      }),
      prisma.product.count({ where: whereClause }),
    ]);


    const finalItems = products.map(p => (

      {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        features: [p.point1, p.point2, p.point3],
        inStock: p.quantity > 0,
        image: p.main,
        popular: p.quantity < 100 && p.quantity > 0,
        rating: Math.random().toFixed
      }))

    return c.json({
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      items: finalItems,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    c.status(500);
    return c.json({ error: "Failed to fetch products" });
  }
});

// currently using this
productRouter.get('/products', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const search = c.req.query('search')?.toLowerCase() || '';

  const whereClause: Prisma.productWhereInput | undefined = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }
    : undefined;

  try {
    const products = await prisma.product.findMany({
      where: whereClause,
    });

    const finalItems = products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      features: [p.point1, p.point2, p.point3],
      inStock: p.quantity > 0,
      image: p.main,
      popular: p.quantity < 100 && p.quantity > 0,
      rating: Math.floor(Math.random() * 5) + 1, // random rating 1-5
    }));

    return c.json({
      totalItems: products.length,
      items: finalItems,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    c.status(500);
    return c.json({ error: 'Failed to fetch products' });
  }
});



productRouter.get('/images/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const productId = c.req.param('id');

  // Find the product
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    c.status(404);
    return c.json({ error: "Product not found" });
  }

  const image = [
    {
      url: product.main
    },
    {
      url: product.left
    },
    {
      url: product.top
    }
  ]

  return c.json({ image });
});