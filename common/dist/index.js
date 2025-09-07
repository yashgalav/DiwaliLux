"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBuySchema = exports.deliveryAddressSchema = exports.orderItemSchema = exports.addItemToCart = exports.forgetPassword = exports.sendOtp = exports.VerifyOTP = exports.createProduct = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
// signup
exports.signupInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().optional(),
    userImage: zod_1.z.string().optional()
});
// signin
exports.signinInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
//create product 
exports.createProduct = zod_1.z.object({
    productName: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.number(),
    originalPrice: zod_1.z.number(),
    point1: zod_1.z.string().min(10),
    point2: zod_1.z.string().min(10),
    point3: zod_1.z.string().min(10),
    main: zod_1.z.instanceof(File, { message: "Image file is required" }),
    left: zod_1.z.instanceof(File, { message: "Image file is required" }),
    top: zod_1.z.instanceof(File, { message: "Image file is required" }),
});
// verify otp
exports.VerifyOTP = zod_1.z.object({
    otp: zod_1.z.number(),
    email: zod_1.z.string().email(),
    otpSignupInput: exports.signupInput // ✅ use as schema
});
//send otp
// verify otp
exports.sendOtp = zod_1.z.object({
    email: zod_1.z.string().email(),
});
// verify otp
exports.forgetPassword = zod_1.z.object({
    otp: zod_1.z.number(),
    email: zod_1.z.string().email(),
    otpSigninInput: exports.signinInput // ✅ use as schema
});
// Add item to cart
exports.addItemToCart = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number()
});
exports.orderItemSchema = zod_1.z.object({
    cartId: zod_1.z.string(),
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    price: zod_1.z.number().int().nonnegative(), // snapshot price
});
exports.deliveryAddressSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2, "Full name must be at least 2 characters"),
    phoneNo: zod_1.z
        .string()
        .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number"),
    Address: zod_1.z.string().min(5, "Address must be at least 5 characters long"),
    district: zod_1.z.string().min(2, "District is required"),
    state: zod_1.z.string().min(2, "State is required"),
    pincode: zod_1.z
        .string()
        .regex(/^\d{6}$/, "Pincode must be a 6-digit number"),
});
exports.orderBuySchema = zod_1.z.object({
    userId: zod_1.z.string(),
    items: zod_1.z.array(exports.orderItemSchema).nonempty(),
    totalAmount: zod_1.z.number().int().nonnegative(),
    delivery: exports.deliveryAddressSchema,
    status: zod_1.z.string(), // maybe better: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]) 
});
