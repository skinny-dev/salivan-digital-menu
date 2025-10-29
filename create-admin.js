const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.create({
      data: {
        name: "مدیر سیستم",
        phone: "09120000000",
        username: "admin",
        password: hashedPassword,
        role: "ADMIN",
        phoneVerified: true,
      },
    });
    console.log("Admin user created successfully:", admin.username);
  } catch (error) {
    if (error.code === "P2002") {
      console.log("Admin user already exists");
    } else {
      console.log("Error creating admin:", error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
