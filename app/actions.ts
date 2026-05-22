"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email. Use a format like example@email.com." };
  }

  const isMatch = await bcrypt.compare(password, user.password || "");

  if (!isMatch) {
    return { error: "Incorrect password. Please try again." };
  }

  return { success: true };
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirm = formData.get("confirm")?.toString() || "";

  // 1. Validation
  if (!email || !password || !confirm) {
    return { error: "Fill in all fields." };
  }

  if (!emailRegex.test(email)) {
    return { error: "Invalid email. Use a format like example@email.com" };
  }

  if (password !== confirm) {
    return { error: "Those password did’t match, Try again" };
  }

  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters, include a number, capital letter, and a symbol.",
    };
  }

  // 2. Хэрэглэгч бүртгэгдсэн эсэхийг шалгах
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна." };
  }

  // 3. Нууц үгийг hash хийх
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Шинэ хэрэглэгч үүсгэх
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phoneNumber: "",
        address: "",
      },
    });

    // 5. ИМЭЙЛ ИЛГЭЭХ
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="http://localhost:3000/verify?email=${email}">here</a> to verify your account</p>`,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Something went wrong, please try again." };
  }

  return { success: true };
}

export async function sendResetLinkAction(formData: FormData) {
  const email = formData.get("email")?.toString().toLowerCase().trim() || "";

  // 1. И-мэйл бүтэц шалгах
  if (!emailRegex.test(email)) {
    return { error: "Invalid email. Use a format like example@email.com" };
  }

  try {
    // 2. Хэрэглэгч байгаа эсэхийг шалгах
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Аюулгүй байдлын үүднээс и-мэйл байхгүй бол
      // "Имэйл илгээгдлээ" гэж хэлэх нь хэрэглэгчийг төөрөлдүүлэхгүй
      return { error: "User not found." };
    }

    // 3. Имэйл илгээх (Нууц үг сэргээх линк)
    await resend.emails.send({
      from: "onboarding@resend.dev", // Өөрийн домайн эсвэл илгээгчээ тохируулна уу
      to: email,
      subject: "Reset your password",
      html: `
        <h1>Reset your password</h1>
        <p>You requested a password reset. Click the link below to continue:</p>
        <a href="http://localhost:3000/reset-password?email=${email}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { error: "Failed to send reset link. Please try again." };
  }
}

export async function updatePasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Regex шалгалт (өмнөх дүрмээрээ)
  if (!passwordRegex.test(password)) {
    return {
      error:
        "Password must be at least 8 characters, include a number, capital letter, and a symbol.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to update password." };
  }
}
