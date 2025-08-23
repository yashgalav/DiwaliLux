import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import { forgetPassword, sendOtp, signinInput, signupInput, VerifyOTP } from "@yashxdev/diwalilux-common";
import { OAuth2Client } from "google-auth-library";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { verify } from "crypto";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GOOGLE_CLIENT_ID: string
    RESEND_API_KEY: string
  };
}>();

const client = new OAuth2Client();



// --- ADMIN SIGNIN ---
userRouter.post("/admin/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const parsedBody = signinInput.safeParse(body);

  if (!parsedBody.success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      isAdmin: true
    },
  });

  if (!user) {
    c.status(401);
    return c.json({ message: "This portal is only for admin! please visit diwalilux.com " });
  }

  // Compare password
  if (!user.password) {
    return c.json({ message: "Please SignIn with Google!" }, 400);
  }
  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    c.status(403);
    return c.json({ message: "Invalid password" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({
    jwt: jwt,
    name: user.name,
    userId: user.id,
  });
});


// --- SIGNIN ---
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const parsedBody = signinInput.safeParse(body);

  if (!parsedBody.success) {
    c.status(411);
    return c.json({
      message: "Invalid inputs",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    c.status(401);
    return c.json({ message: "User not found!" });
  }

  // Compare password
  if (!user.password) {
    return c.json({ message: "Please SignIn with Google!" }, 400);
  }
  const isPasswordValid = await bcrypt.compare(body.password, user.password);
  if (!isPasswordValid) {
    c.status(403);
    return c.json({ message: "Invalid password" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({
    jwt: jwt,
    name: user.name,
    userId: user.id,
  });
});


// google login 
userRouter.post("/auth/google-login", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const googleToken = body.token;

  if (!googleToken) {
    return c.json({ error: "Token is missing" }, 400);
  }

  try {
    // Step 1: Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: googleToken,
      audience: c.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      return c.json({ error: "Invalid Google token" }, 400);
    }

    const googleId = payload.sub;

    // Step 2: Check for existing user with googleId
    let user = await prisma.user.findUnique({
      where: { googleId },
    });
    

    // Step 3: Fallback - check by email if user created without googleId
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: payload.email}
      });

      // Step 4: If user exists by email but not linked, update with googleId
      if (user && !user.googleId) {
        user = await prisma.user.update({
          where: { email: payload.email },
          data: {
            googleId,
            userImage: payload.picture ?? undefined,
            name: payload.name ?? user.name,
          },
        });
      }
    }

    // Step 5: If user still doesn't exist, create new
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          googleId,
          name: payload.name ?? "",
          password: null,
          userImage: payload.picture,
          loginMethod: "google-login"
        },
      });
    }

    // Step 6: Generate JWT
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
      name: user.name,
      userId: user.id,
      image: user.userImage,
    });

  } catch (err) {
    console.error("Google login error:", err);
    return c.json({ error: "Login failed" }, 500);
  }
});


// send otp
userRouter.post("/send-otp", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const parsedBody = sendOtp.safeParse(body);
    console.log("here 1");

    if (!parsedBody.success) {
      c.status(411);
      return c.json({
        message: "Invalid Email!",
      });
    }
    const email = parsedBody.data.email;

    if (!email) {
      return c.json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const existingOtp = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (existingOtp && existingOtp.expiresAt > new Date()) {
      return c.json({ message: "OTP already sent. Please try again after 5 minutes, and check your spam folder." });
    }

    if (existingOtp) {
      await prisma.otp.update({
        where: { id: existingOtp.id },
        data: {
          otp: parseInt(otp),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    } else {
      await prisma.otp.create({
        data: {
          email,
          otp: parseInt(otp),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });
    }

    try {
      await sendResendEmail(
        email,
        "Your OTP Code",
        `Your OTP is ${otp}. It will expire in 5 minutes.`
      );
      console.log(`✅ OTP email sent to ${email}`);
    } catch (err) {
      console.error("❌ Failed to send OTP email:", err);
      throw err; // Rethrow so route can handle
    }
    return c.json({ message: "OTP sent successfully" });
  } catch (err: any) {
    return c.json({ message: err.message }, 400);
  }
});

// resend-api code
async function sendResendEmail(to: string, subject: string, text: string) {
  const apiKey = process.env.RESEND_API_KEY!;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "DiwaliLux <luxury@diwalilux.com>", // or your verified sender domain onboarding@resend.dev
      to: [to],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend send failed: ${err}`);
  }
}


// verify otp
userRouter.post("/verify-otp", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = VerifyOTP.safeParse(body);

    if (!success) {
      return c.json({ message: "Input not correct!" }, 400);
    }
    const { email, otp, otpSignupInput } = body;

    if (!email || !otp) {
      return c.json({ message: "Email and OTP are required!" }, 400);
    }

    const record = await prisma.otp.findFirst({
      where: { email, otp: parseInt(otp) },
    });

    if (!record || record.expiresAt < new Date()) {
      return c.json({ message: "Invalid or expired OTP!" }, 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: otpSignupInput.email },
    });
    if (existingUser) {
      return c.json({ message: "Email already in use!" }, 400);
    }

    const hashedPassword = await bcrypt.hash(otpSignupInput.password, 10);

    const user = await prisma.user.create({
      data: {
        email: otpSignupInput.email,
        password: hashedPassword,
        name: otpSignupInput.name,
        loginMethod: "manual-signup",
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    await prisma.otp.delete({
      where: { id: record.id },
    });

    return c.json({
      message: "Email verified successfully!",
      jwt: token,
      name: user.name,
      userId: user.id,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});


// forget password
userRouter.post("/forget-password", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();

    const { success } = forgetPassword.safeParse(body);

    if (!success) {
      return c.json({ message: "Input not correct!" }, 400);
    }
    const { email, otp, otpSigninInput } = body;

    if (!email || !otp) {
      return c.json({ message: "Email and OTP are required!" }, 400);
    }

    const record = await prisma.otp.findFirst({
      where: { email, otp: parseInt(otp) },
    });

    if (!record || record.expiresAt < new Date()) {
      return c.json({ message: "Invalid or expired OTP!" }, 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: otpSigninInput.email },
    });
    if (!existingUser) {
      return c.json({ message: "User not found!" }, 400);
    }

    const hashedPassword = await bcrypt.hash(otpSigninInput.password, 10);

    const user = await prisma.user.update({
      where: {
        email: otpSigninInput.email, // Find the user by email
      },
      data: {
        password: hashedPassword,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    await prisma.otp.delete({
      where: { id: record.id },
    });

    return c.json({
      message: "Password changed successfully!",
      jwt: token,
      name: user.name,
      userId: user.id,
    });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

