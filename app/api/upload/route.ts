import { NextResponse, NextRequest } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    // 1. Хүсэлтээр ирсэн Форм датаг (FormData) хүлээж авах
    const formData = await request.formData();
    const file = formData.get("file") as File;

    // Файл ирээгүй бол алдаа буцаана
    if (!file) {
      return NextResponse.json(
        { error: "Файл сонгогдоогүй байна" },
        { status: 400 },
      );
    }

    // 2. Файлыг Buffer руу хөрвүүлэх (Сервер дээр хадгалахад бэлдэх)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Файлын нэрийг давхцахгүй болгох үүднээс Timestamp нэмэх (Жишээ нь: 1715849201-pizza.jpg)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.name);
    const fileName = `${file.name.replace(fileExtension, "")}-${uniqueSuffix}${fileExtension}`;

    // 4. Хадгалах замыг зааж өгөх (public/uploads/ хавтас руу)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    // public/uploads хавтас байхгүй бол автоматаар үүсгэх хамгаалалт
    await fs.mkdir(uploadDir, { recursive: true });

    // 5. Файлыг заасан замд хадгалах
    await fs.writeFile(filePath, buffer);

    // 6. Фронт-энд уншиж болохуйц URL хаягийг буцаах
    // Жишээ нь: /uploads/pizza-1715849201.jpg
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json(
      {
        message: "Зураг амжилттай ачаалагдлаа",
        url: fileUrl,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Зураг хуулахад алдаа гарлаа" },
      { status: 500 },
    );
  }
}
