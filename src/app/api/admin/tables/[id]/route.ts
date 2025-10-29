import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
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

    const { number, name, capacity, isActive } = await request.json();
    const tableId = params.id;

    // Check if new number conflicts with existing table (excluding current table)
    if (number) {
      const existingTable = await prisma.table.findFirst({
        where: {
          number,
          NOT: { id: tableId },
        },
      });

      if (existingTable) {
        return NextResponse.json(
          { error: "میز با این شماره قبلاً وجود دارد" },
          { status: 400 }
        );
      }
    }

    const table = await prisma.table.update({
      where: { id: tableId },
      data: {
        ...(number !== undefined && { number }),
        ...(name !== undefined && { name }),
        ...(capacity !== undefined && { capacity }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error("Error updating table:", error);
    return NextResponse.json(
      { error: "Failed to update table" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value;
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

    const tableId = params.id;

    // Check if table has any orders
    const ordersCount = await prisma.order.count({
      where: { tableId },
    });

    if (ordersCount > 0) {
      return NextResponse.json(
        { error: "نمی‌توان میزی را که سفارش دارد حذف کرد" },
        { status: 400 }
      );
    }

    await prisma.table.delete({
      where: { id: tableId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting table:", error);
    return NextResponse.json(
      { error: "Failed to delete table" },
      { status: 500 }
    );
  }
}
