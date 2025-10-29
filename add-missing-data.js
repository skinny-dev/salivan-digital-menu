const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addMissingData() {
  try {
    // Add customers if they don't exist
    const customerCount = await prisma.customer.count();
    if (customerCount === 0) {
      console.log("Adding sample customers...");
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
      console.log("Customers added!");
    }

    // Add printers if they don't exist
    const printerCount = await prisma.printer.count();
    if (printerCount === 0) {
      console.log("Adding sample printers...");

      // Get first few categories
      const categories = await prisma.category.findMany({ take: 2 });

      if (categories.length > 0) {
        const kitchenPrinter = await prisma.printer.create({
          data: {
            name: "آشپزخانه",
            description: "پرینتر آشپزخانه",
            ipAddress: "192.168.1.100",
            port: 9100,
            isOnline: true,
            isActive: true,
            categories: {
              create: [{ categoryId: categories[0].id }],
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
              create: categories.map((cat) => ({ categoryId: cat.id })),
            },
          },
        });

        console.log("Printers added!");
        console.log("Kitchen Printer ID:", kitchenPrinter.id);
        console.log("Cashier Printer ID:", cashierPrinter.id);
      }
    }

    // Show final counts
    const customers = await prisma.customer.count();
    const printers = await prisma.printer.count();
    const categories = await prisma.category.count();
    const menuItems = await prisma.menuItem.count();

    console.log("\nFinal counts:");
    console.log("Categories:", categories);
    console.log("Menu Items:", menuItems);
    console.log("Customers:", customers);
    console.log("Printers:", printers);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingData();
