import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// POST - Create new menu item
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      image,
      order,
      isActive,
      isAvailable,
      categoryId,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        {
          error: "Name, price, and categoryId are required",
        },
        { status: 400 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price: parseInt(price),
        image,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        categoryId,
      },
    });

    return NextResponse.json(menuItem, { status: 201 });
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
