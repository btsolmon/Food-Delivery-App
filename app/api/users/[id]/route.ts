import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // params-ыг Promise болгож өөрчилнө
) {
  // await ашиглан params-аа задална
  const { id } = await params;

  try {
    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "User not found or failed to delete" },
      { status: 404 },
    );
  }
}
