-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "razorpayLink" TEXT,
ADD COLUMN     "razorpayLinkId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;
