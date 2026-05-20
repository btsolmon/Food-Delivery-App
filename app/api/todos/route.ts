import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const todos = await prisma.todo.findMany({ include: { user: true } });
  return NextResponse.json(todos);
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const newTodo = await prisma.todo.create({
    data: {
      title: data.title,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
    include: {
      user: true,
    },
  });
  return NextResponse.json(newTodo);
};
