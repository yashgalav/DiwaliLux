import { z } from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    userImage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type signupInputType = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type signinInputType = z.infer<typeof signinInput>;
export declare const createProduct: z.ZodObject<{
    productName: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    originalPrice: z.ZodNumber;
    point1: z.ZodString;
    point2: z.ZodString;
    point3: z.ZodString;
    main: z.ZodCustom<File, File>;
    left: z.ZodCustom<File, File>;
    top: z.ZodCustom<File, File>;
}, z.core.$strip>;
export type createProductInputType = z.infer<typeof createProduct>;
export declare const VerifyOTP: z.ZodObject<{
    otp: z.ZodNumber;
    email: z.ZodString;
    otpSignupInput: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
        userImage: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type VerifyOTPType = z.infer<typeof VerifyOTP>;
export declare const sendOtp: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type sendOtpType = z.infer<typeof sendOtp>;
export declare const forgetPassword: z.ZodObject<{
    otp: z.ZodNumber;
    email: z.ZodString;
    otpSigninInput: z.ZodObject<{
        email: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type forgetPasswordType = z.infer<typeof forgetPassword>;
export declare const addItemToCart: z.ZodObject<{
    productId: z.ZodString;
    quantity: z.ZodNumber;
}, z.core.$strip>;
export type addItemToCartType = z.infer<typeof addItemToCart>;
export declare const orderItemSchema: z.ZodObject<{
    cartId: z.ZodString;
    productId: z.ZodString;
    quantity: z.ZodNumber;
    price: z.ZodNumber;
}, z.core.$strip>;
export type orderItemType = z.infer<typeof orderItemSchema>;
export declare const orderBuySchema: z.ZodObject<{
    userId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        cartId: z.ZodString;
        productId: z.ZodString;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
    }, z.core.$strip>>;
    totalAmount: z.ZodNumber;
    name: z.ZodString;
    phoneNo: z.ZodString;
    address: z.ZodString;
    status: z.ZodString;
}, z.core.$strip>;
export type OrderBuyType = z.infer<typeof orderBuySchema>;
