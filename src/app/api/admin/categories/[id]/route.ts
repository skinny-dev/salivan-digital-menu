import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// PUT - Update category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { name, emoji, order, isActive, availableFrom, availableTo } = body;
    const resolvedParams = await params;

    const category = await prisma.category.update({
      where: { id: resolvedParams.id },
      data: {
        ...(name !== undefined && { name }),
        ...(emoji !== undefined && { emoji }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(availableFrom !== undefined && { availableFrom }),
        ...(availableTo !== undefined && { availableTo }),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const resolvedParams = await params;

    // Check if category has menu items
    const menuItemsCount = await prisma.menuItem.count({
      where: { categoryId: resolvedParams.id },
    });

    if (menuItemsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing menu items" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
