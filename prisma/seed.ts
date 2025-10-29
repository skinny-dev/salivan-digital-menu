import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin and staff users
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "مدیر سیستم",
        phone: "09120000000",
        username: "admin",
        password: adminPassword,
        role: "ADMIN",
        phoneVerified: true,
      },
      {
        name: "گارسون",
        phone: "09120000001",
        username: "waiter",
        password: staffPassword,
        role: "STAFF",
        phoneVerified: true,
      },
    ],
  });

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      {
        name: "پیش غذا",
        emoji: "🍟",
        order: 1,
        availableFrom: "11:00",
        availableTo: "24:00",
      },
      {
        name: "صبحانه",
        emoji: "🍳",
        order: 2,
        availableFrom: "07:00",
        availableTo: "12:00",
      },
      {
        name: "پیتزا ایتالیایی",
        emoji: "🍕",
        order: 3,
      },
      {
        name: "پیتزا آمریکایی",
        emoji: "🍔",
        order: 4,
      },
      {
        name: "نوشیدنی",
        emoji: "🥤",
        order: 5,
      },
    ],
  });

  // Get category IDs
  const allCategories = await prisma.category.findMany();
  const appetizerId = allCategories.find((c) => c.name === "پیش غذا")?.id;
  const breakfastId = allCategories.find((c) => c.name === "صبحانه")?.id;
  const italianPizzaId = allCategories.find(
    (c) => c.name === "پیتزا ایتالیایی"
  )?.id;

  // Create menu items
  if (appetizerId) {
    await prisma.menuItem.createMany({
      data: [
        {
          name: "سیب زمینی سرخ کرده",
          description: "سیب زمینی تازه و ترد",
          price: 85000,
          image: "french-fries.jpg",
          categoryId: appetizerId,
          order: 1,
        },
        {
          name: "استریپس مرغ",
          description: "استریپس مرغ سوخاری",
          price: 165000,
          image: "strips.jpg",
          categoryId: appetizerId,
          order: 2,
        },
      ],
    });
  }

  if (breakfastId) {
    await prisma.menuItem.create({
      data: {
        name: "صبحانه کامل",
        description: "صبحانه سنتی با نان، پنیر، مربا",
        price: 145000,
        image: "breakfast.jpg",
        categoryId: breakfastId,
        order: 1,
      },
    });
  }

  if (italianPizzaId) {
    await prisma.menuItem.create({
      data: {
        name: "پیتزا ایتالیایی",
        description: "پیتزا ایتالیایی اصل با مواد تازه",
        price: 225000,
        image: "italian-pizza.jpg",
        categoryId: italianPizzaId,
        order: 1,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
