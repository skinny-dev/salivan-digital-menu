import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    console.log("Setting up database...");

    // Create admin user
    const adminExists = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await prisma.user.create({
        data: {
          name: "مدیر سیستم",
          phone: "09123456789",
          username: "admin",
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log("Admin user created");
    }

    // Create staff user
    const staffExists = await prisma.user.findUnique({
      where: { username: "staff" },
    });

    if (!staffExists) {
      const hashedPassword = await bcrypt.hash("staff123", 10);
      await prisma.user.create({
        data: {
          name: "کارکنان",
          phone: "09987654321",
          username: "staff",
          password: hashedPassword,
          role: "STAFF",
        },
      });
      console.log("Staff user created");
    }

    return NextResponse.json({
      message: "Users setup completed successfully",
      admin: "admin/admin123",
      staff: "staff/staff123",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      {
        error: "Setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
