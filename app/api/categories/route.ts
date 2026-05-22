import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Чиний түрүүний үүсгэсэн файлын зам

// 1. Ангилалуудыг авах (GET)
export async function GET() {
  try {
    const categories = await prisma.foodCategory.findMany({
      include: { foods: true }, // Тухайн ангилалд байгаа хоолнуудыг хамт авна
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Категори уншихад алдаа гарлаа" },
      { status: 500 },
    );
  }
}

// 2. Шинэ ангилал нэмэх (POST)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryName } = body;

    if (!categoryName) {
      return NextResponse.json(
        { error: "Нэр заавал хэрэгтэй" },
        { status: 400 },
      );
    }

    const newCategory = await prisma.foodCategory.create({
      data: { categoryName },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Категори үүсгэхэд алдаа гарлаа" },
      { status: 500 },
    );
  }
}
