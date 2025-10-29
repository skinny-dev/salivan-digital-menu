import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  try {
    // Delete existing users first
    await prisma.user.deleteMany({
      where: {
        username: {
          in: ["admin", "waiter"],
        },
      },
    });

    console.log("Deleted existing users");

    // Create admin and staff users
    const adminPassword = await bcrypt.hash("admin123", 10);
    const staffPassword = await bcrypt.hash("staff123", 10);

    const admin = await prisma.user.create({
      data: {
        name: "مدیر سیستم",
        phone: "09120000000",
        username: "admin",
        password: adminPassword,
        role: "ADMIN",
        phoneVerified: true,
      },
    });

    console.log("Created admin user:", admin.username);

    const staff = await prisma.user.create({
      data: {
        name: "گارسون",
        phone: "09120000001",
        username: "waiter",
        password: staffPassword,
        role: "STAFF",
        phoneVerified: true,
      },
    });

    console.log("Created staff user:", staff.username);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
