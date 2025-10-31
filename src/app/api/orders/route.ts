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

    const orders = await prisma.order.findMany({
      include: {
        items: true,
        table: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت سفارشات" },
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

    const { phone, orderType, address, notes, items, totalAmount, tableId } =
      await request.json();

    const order = await prisma.order.create({
      data: {
        phone,
        orderType,
        address: orderType === "DELIVERY" ? address : null,
        notes,
        totalAmount,
        tableId: orderType === "DINE_IN" ? tableId : null,
        createdBy: user.id,
        items: {
          create: items.map((item: { name: string; price: number; quantity: number; image?: string; menuItemId: string }) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            menuItemId: item.menuItemId,
          })),
        },
      },
      include: {
        items: true,
        table: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "خطا در ایجاد سفارش" }, { status: 500 });
  }
}
