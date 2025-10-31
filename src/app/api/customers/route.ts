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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let customers;
    if (search) {
      customers = await prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { lastName: { contains: search } },
            { phone: { contains: search } },
            { membershipCode: { contains: search } }
          ]
        },
        orderBy: { createdAt: "desc" },
        take: 10
      });
    } else {
      customers = await prisma.customer.findMany({
        orderBy: { createdAt: "desc" },
        take: 50
      });
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    return NextResponse.json({ error: "خطا در دریافت مشتریان" }, { status: 500 });
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

    const { name, lastName, phone, address } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: "نام و شماره تماس الزامی است" }, { status: 400 });
    }

    // Check if phone already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone }
    });

    if (existingCustomer) {
      return NextResponse.json({ error: "این شماره تماس قبلاً ثبت شده" }, { status: 400 });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        lastName: lastName || "",
        phone,
        address: address || "",
        membershipCode: `C${Date.now()}` // Generate membership code
      }
    });

    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error("Create customer error:", error);
    return NextResponse.json({ error: "خطا در ایجاد مشتری" }, { status: 500 });
  }
}
