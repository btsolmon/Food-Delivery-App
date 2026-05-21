"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error(
    "АНХААРУУЛГА: RESEND_API_KEY олдохгүй байна! .env.local файлаа шалга.",
  );
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  // 1. Хэрэглэгч байгаа эсэхийг шалгах
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Invalid email. Use a format like example@email.com." };
  }

  // 2. Нууц үг таарч байгаа эсэхийг шалгах (Hash хийгдсэн нууц үгтэй харьцуулна)
  const isMatch = await bcrypt.compare(password, user.password || "");

  if (!isMatch) {
    return { error: "Incorrect password. Please try again." };
  }

  return { success: true };
}

export async function registerAction(formData: FormData) {
  // formData-аас авсан утгуудаа string гэдгийг батлахын тулд .toString() эсвэл as string ашиглана
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirm = formData.get("confirm")?.toString() || "";

  // 1. Validation
  if (!email || !password || !confirm) {
    return { error: "Fill in all fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Invalid email. Use a format like example@email.com" };
  }

  if (password !== confirm) {
    return { error: "Those password did’t match, Try again" };
  }

  // 2. Хэрэглэгч бүртгэгдсэн эсэхийг шалгах
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Энэ имэйл хаяг аль хэдийн бүртгэгдсэн байна." };
  }

  // 3. Нууц үгийг hash хийх
  // .toString() хийснээр password заавал string байна
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Шинэ хэрэглэгч үүсгэх
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // 5. ИМЭЙЛ ИЛГЭЭХ
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="http://localhost:3000/verify?email=${email}">here</a> to verify your account</p>`,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    // Хэрэв имэйл илгээхэд алдаа гарвал энд зөвхөн бүртгэл амжилттай болсныг мэдэгдэж болно
  }

  return { success: true };
}

export async function sendResetLinkAction(formData: FormData) {
  const email = formData.get("email") as string;
  // Энд имэйл илгээх (Nodemailer эсвэл Resend ашиглах) логик байна
  console.log("Reset link requested for:", email);
  return { success: true };
}
