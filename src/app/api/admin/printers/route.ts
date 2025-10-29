import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const printers = await prisma.printer.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(printers);
  } catch (error) {
    console.error("Get printers error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت پرینترها" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const { name, description, ipAddress, port, categoryIds } =
      await request.json();

    if (!name || !ipAddress) {
      return NextResponse.json(
        { error: "نام و آدرس IP الزامی است" },
        { status: 400 }
      );
    }

    const printer = await prisma.printer.create({
      data: {
        name,
        description: description || "",
        ipAddress,
        port: port || 9100,
        isOnline: false, // Initially offline, will be tested
        categories: {
          create:
            categoryIds?.map((categoryId: string) => ({
              categoryId,
            })) || [],
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(printer, { status: 201 });
  } catch (error) {
    console.error("Create printer error:", error);
    return NextResponse.json({ error: "خطا در ایجاد پرینتر" }, { status: 500 });
  }
}
