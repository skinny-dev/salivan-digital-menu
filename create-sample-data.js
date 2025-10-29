const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkData() {
  try {
    const categories = await prisma.category.findMany();
    const menuItems = await prisma.menuItem.findMany();
    const tables = await prisma.table.findMany();
    const customers = await prisma.customer.findMany();
    const printers = await prisma.printer.findMany();

    console.log("Categories:", categories.length);
    console.log("Menu Items:", menuItems.length);
    console.log("Tables:", tables.length);
    console.log("Customers:", customers.length);
    console.log("Printers:", printers.length);

    if (categories.length === 0) {
      console.log("No categories found. Creating sample data...");
      await createSampleData();
    } else {
      console.log("Data already exists!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function createSampleData() {
  try {
    // Create sample categories
    const foodCategory = await prisma.category.create({
      data: {
        name: "غذاهای اصلی",
        emoji: "🍽️",
        order: 1,
        isActive: true,
      },
    });

    const drinkCategory = await prisma.category.create({
      data: {
        name: "نوشیدنی",
        emoji: "🥤",
        order: 2,
        isActive: true,
      },
    });

    // Create sample menu items
    await prisma.menuItem.createMany({
      data: [
        {
          name: "برگر مخصوص",
          description: "برگر گوشت با سبزیجات تازه",
          price: 150000,
          categoryId: foodCategory.id,
          isActive: true,
          isAvailable: true,
          order: 1,
        },
        {
          name: "پیتزا مارگاریتا",
          description: "پیتزا با پنیر موزارلا و ریحان",
          price: 200000,
          categoryId: foodCategory.id,
          isActive: true,
          isAvailable: true,
          order: 2,
        },
        {
          name: "نوشابه",
          description: "نوشابه سرد",
          price: 25000,
          categoryId: drinkCategory.id,
          isActive: true,
          isAvailable: true,
          order: 1,
        },
      ],
    });

    // Create sample tables
    await prisma.table.createMany({
      data: [
        { number: 1, name: "میز 1", capacity: 4 },
        { number: 2, name: "میز 2", capacity: 2 },
        { number: 3, name: "میز 3", capacity: 6 },
      ],
    });

    // Create sample customers
    await prisma.customer.createMany({
      data: [
        {
          name: "علی",
          lastName: "احمدی",
          phone: "09121234567",
          membershipCode: "C1001",
          address: "تهران، خیابان ولیعصر",
        },
        {
          name: "فاطمه",
          lastName: "محمدی",
          phone: "09129876543",
          membershipCode: "C1002",
          address: "تهران، خیابان انقلاب",
        },
      ],
    });

    // Create sample printers
    const kitchenPrinter = await prisma.printer.create({
      data: {
        name: "آشپزخانه",
        description: "پرینتر آشپزخانه",
        ipAddress: "192.168.1.100",
        port: 9100,
        isOnline: true,
        isActive: true,
        categories: {
          create: [{ categoryId: foodCategory.id }],
        },
      },
    });

    const cashierPrinter = await prisma.printer.create({
      data: {
        name: "صندوق",
        description: "پرینتر صندوق",
        ipAddress: "192.168.1.101",
        port: 9100,
        isOnline: true,
        isActive: true,
        categories: {
          create: [
            { categoryId: foodCategory.id },
            { categoryId: drinkCategory.id },
          ],
        },
      },
    });

    console.log("Sample data created successfully!");
    console.log("Kitchen Printer ID:", kitchenPrinter.id);
    console.log("Cashier Printer ID:", cashierPrinter.id);
  } catch (error) {
    console.error("Error creating sample data:", error);
  }
}

checkData();
