import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
};

export const POST = async (req: NextRequest) => {
  const data: Prisma.UserCreateInput = await req.json();
  const newUser = await prisma.user.create({
    data: data,
  });

  return NextResponse.json(newUser);
};
