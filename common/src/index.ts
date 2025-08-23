import { z } from "zod";

// signup
export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    userImage: z.string().optional()
})

export type signupInputType = z.infer<typeof signupInput>

// signin
export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export type signinInputType = z.infer<typeof signinInput>

//create product 
export const createProduct = z.object({
    productName: z.string(),
    description: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    point1: z.string().min(10),
    point2: z.string().min(10),
    point3: z.string().min(10),
    main: z.instanceof(File, { message: "Image file is required" }),
    left: z.instanceof(File, { message: "Image file is required" }),
    top: z.instanceof(File, { message: "Image file is required" }),
})

export type createProductInputType = z.infer<typeof createProduct>


// verify otp
export const VerifyOTP = z.object({
    otp: z.number(),
    email: z.string().email(),
    otpSignupInput: signupInput // ✅ use as schema
});

export type VerifyOTPType = z.infer<typeof VerifyOTP>;


//send otp
// verify otp
export const sendOtp = z.object({
    email: z.string().email(),
});

export type sendOtpType = z.infer<typeof sendOtp>;


// verify otp
export const forgetPassword = z.object({
    otp: z.number(),
    email: z.string().email(),
    otpSigninInput: signinInput // ✅ use as schema
});

export type forgetPasswordType = z.infer<typeof forgetPassword>;



// Add item to cart
export const addItemToCart = z.object({
    productId: z.string(),
    quantity: z.number()
});

export type addItemToCartType = z.infer<typeof addItemToCart>;

export const orderItemSchema = z.object({
  cartId:z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().int().nonnegative(), // snapshot price
});

export type orderItemType = z.infer<typeof orderItemSchema>;

export const orderBuySchema = z.object({
  userId: z.string(),
  items: z.array(orderItemSchema).nonempty(),
  totalAmount: z.number().int().nonnegative(),
  name: z.string().min(1),
  phoneNo: z.string().min(8).max(15), // can add regex if needed
  address: z.string().min(5),
  status: z.string(), // maybe better: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]) 
});

export type OrderBuyType = z.infer<typeof orderBuySchema>;