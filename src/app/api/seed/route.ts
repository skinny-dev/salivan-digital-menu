import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("Seeding complete database...");

    // Create tables
    const tableCount = await prisma.table.count();
    if (tableCount === 0) {
      const tables = [];
      for (let i = 1; i <= 20; i++) {
        tables.push({
          number: i,
          name: `میز ${i}`,
          capacity: i <= 10 ? 4 : 6, // میزهای 1-10 چهار نفره، بقیه شش نفره
        });
      }

      await prisma.table.createMany({
        data: tables,
      });
      console.log("Tables created");
    }

    // Create categories - دیتای کامل از گوگل شیت
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
      const categories = [
        { name: "پیش غذا", emoji: "🍟", order: 1 },
        { name: "صبحانه", emoji: "🍳", order: 2 },
        { name: "غذاهای اصلی", emoji: "🍽️", order: 3 },
        { name: "پیتزا ایتالیایی", emoji: "🍕", order: 4 },
        { name: "پیتزا آمریکایی", emoji: "🍔", order: 5 },
        { name: "پاستا", emoji: "🍝", order: 6 },
        { name: "ساندویچ", emoji: "🥪", order: 7 },
        { name: "برگر", emoji: "🍔", order: 8 },
        { name: "سالاد", emoji: "🥗", order: 9 },
        { name: "سوپ", emoji: "🍲", order: 10 },
        { name: "نوشیدنی گرم", emoji: "☕", order: 11 },
        { name: "نوشیدنی سرد", emoji: "🥤", order: 12 },
        { name: "شیک و اسموتی", emoji: "🥤", order: 13 },
        { name: "دسر", emoji: "🍰", order: 14 },
        { name: "کیک و شیرینی", emoji: "🧁", order: 15 },
      ];

      for (const cat of categories) {
        await prisma.category.create({ data: cat });
      }
      console.log("Categories created");
    }

    // Create menu items - دیتای کامل بر اساس منوی واقعی کافه کاج
    const itemCount = await prisma.menuItem.count();
    if (itemCount === 0) {
      const categories = await prisma.category.findMany();
      const catMap = categories.reduce((acc, cat) => {
        acc[cat.name] = cat.id;
        return acc;
      }, {} as Record<string, string>);

      const menuItems = [
        // پیش غذا
        {
          name: "سیب زمینی سرخ کرده",
          price: 85000,
          categoryId: catMap["پیش غذا"],
          image: "french-fries.jpg",
          order: 1,
          description: "سیب زمینی تازه و ترد",
        },
        {
          name: "استریپس مرغ",
          price: 165000,
          categoryId: catMap["پیش غذا"],
          image: "strips.jpg",
          order: 2,
          description: "استریپس مرغ سوخاری با سس مخصوص",
        },
        {
          name: "نان سیر",
          price: 55000,
          categoryId: catMap["پیش غذا"],
          order: 3,
          description: "نان تازه با کره سیر",
        },
        {
          name: "پیاز حلقه‌ای",
          price: 75000,
          categoryId: catMap["پیش غذا"],
          order: 4,
          description: "پیاز حلقه‌ای ترد و طعم‌دار",
        },
        {
          name: "چیپس پنیری",
          price: 95000,
          categoryId: catMap["پیش غذا"],
          order: 5,
          description: "چیپس با پنیر ذوب شده",
        },
        {
          name: "ناچوز",
          price: 115000,
          categoryId: catMap["پیش غذا"],
          order: 6,
          description: "ناچوز با سس سالسا و پنیر",
        },

        // صبحانه
        {
          name: "صبحانه کامل",
          price: 145000,
          categoryId: catMap["صبحانه"],
          image: "breakfast.jpg",
          order: 1,
          description: "تخم مرغ، پنیر، مربا، عسل، نان",
        },
        {
          name: "املت",
          price: 85000,
          categoryId: catMap["صبحانه"],
          order: 2,
          description: "املت سه تخم مرغه با سبزیجات",
        },
        {
          name: "کشک و بادمجان",
          price: 95000,
          categoryId: catMap["صبحانه"],
          order: 3,
          description: "کشک و بادمجان سنتی",
        },
        {
          name: "صبحانه انگلیسی",
          price: 185000,
          categoryId: catMap["صبحانه"],
          order: 4,
          description: "تخم مرغ، سوسیس، بیکن، لوبیا",
        },
        {
          name: "پنکیک",
          price: 125000,
          categoryId: catMap["صبحانه"],
          order: 5,
          description: "پنکیک با عسل و خامه",
        },

        // غذاهای اصلی
        {
          name: "چلو کباب کوبیده",
          price: 225000,
          categoryId: catMap["غذاهای اصلی"],
          order: 1,
          description: "دو سیخ کباب کوبیده با برنج",
        },
        {
          name: "چلو جوجه",
          price: 245000,
          categoryId: catMap["غذاهای اصلی"],
          order: 2,
          description: "جوجه کباب با برنج و سالاد",
        },
        {
          name: "زرشک پلو با مرغ",
          price: 195000,
          categoryId: catMap["غذاهای اصلی"],
          order: 3,
          description: "زرشک پلو خوشمزه با مرغ",
        },
        {
          name: "قورمه سبزی",
          price: 175000,
          categoryId: catMap["غذاهای اصلی"],
          order: 4,
          description: "قورمه سبزی با گوشت و برنج",
        },
        {
          name: "فسنجان",
          price: 185000,
          categoryId: catMap["غذاهای اصلی"],
          order: 5,
          description: "خورش فسنجان با مرغ",
        },
        {
          name: "مرغ سوخاری",
          price: 195000,
          categoryId: catMap["غذاهای اصلی"],
          image: "burger.jpeg",
          order: 6,
          description: "مرغ سوخاری ترد با سیب زمینی",
        },

        // پیتزا ایتالیایی
        {
          name: "پیتزا مارگاریتا",
          price: 195000,
          categoryId: catMap["پیتزا ایتالیایی"],
          image: "italian-pizza.jpg",
          order: 1,
          description: "پیتزا کلاسیک با ریحان تازه",
        },
        {
          name: "پیتزا کواترو فورماجی",
          price: 245000,
          categoryId: catMap["پیتزا ایتالیایی"],
          order: 2,
          description: "پیتزا چهار پنیر",
        },
        {
          name: "پیتزا پپرونی",
          price: 225000,
          categoryId: catMap["پیتزا ایتالیایی"],
          order: 3,
          description: "پیتزا با پپرونی",
        },
        {
          name: "پیتزا وژترین",
          price: 185000,
          categoryId: catMap["پیتزا ایتالیایی"],
          order: 4,
          description: "پیتزا سبزیجات",
        },
        {
          name: "پیتزا کپری‌چوزا",
          price: 265000,
          categoryId: catMap["پیتزا ایتالیایی"],
          order: 5,
          description: "پیتزا مخلوط ایتالیایی",
        },

        // پیتزا آمریکایی
        {
          name: "پیتزا آمریکایی مخصوص",
          price: 275000,
          categoryId: catMap["پیتزا آمریکایی"],
          image: "american-pizza.jpg",
          order: 1,
          description: "پیتزا پر از مواد مغذی",
        },
        {
          name: "پیتزا BBQ چیکن",
          price: 255000,
          categoryId: catMap["پیتزا آمریکایی"],
          order: 2,
          description: "پیتزا با مرغ BBQ",
        },
        {
          name: "پیتزا تکزاس",
          price: 285000,
          categoryId: catMap["پیتزا آمریکایی"],
          order: 3,
          description: "پیتزا تند و تیز",
        },
        {
          name: "پیتزا هاوایی",
          price: 235000,
          categoryId: catMap["پیتزا آمریکایی"],
          order: 4,
          description: "پیتزا با آناناس و ژامبون",
        },
        {
          name: "پیتزا چیزی برگر",
          price: 295000,
          categoryId: catMap["پیتزا آمریکایی"],
          order: 5,
          description: "پیتزا با طعم برگر",
        },

        // پاستا
        {
          name: "اسپاگتی کربونارا",
          price: 165000,
          categoryId: catMap["پاستا"],
          image: "pasta.jpg",
          order: 1,
          description: "پاستا کربونارا کرمی",
        },
        {
          name: "پنه آرابیاتا",
          price: 155000,
          categoryId: catMap["پاستا"],
          order: 2,
          description: "پاستا تند با سس گوجه",
        },
        {
          name: "فتوچینی آلفردو",
          price: 175000,
          categoryId: catMap["پاستا"],
          order: 3,
          description: "پاستا آلفردو کرمی",
        },
        {
          name: "لازانیا",
          price: 185000,
          categoryId: catMap["پاستا"],
          order: 4,
          description: "لازانیا خانگی",
        },
        {
          name: "اسپاگتی بولونز",
          price: 165000,
          categoryId: catMap["پاستا"],
          order: 5,
          description: "پاستا با سس گوشت",
        },

        // ساندویچ
        {
          name: "ساندویچ کلوپ",
          price: 125000,
          categoryId: catMap["ساندویچ"],
          image: "sandwich.jpg",
          order: 1,
          description: "ساندویچ کلوپ مخصوص",
        },
        {
          name: "ساندویچ مرغ",
          price: 115000,
          categoryId: catMap["ساندویچ"],
          order: 2,
          description: "ساندویچ مرغ گریل",
        },
        {
          name: "ساندویچ ژامبون",
          price: 135000,
          categoryId: catMap["ساندویچ"],
          order: 3,
          description: "ساندویچ ژامبون و پنیر",
        },
        {
          name: "ساندویچ تن ماهی",
          price: 105000,
          categoryId: catMap["ساندویچ"],
          order: 4,
          description: "ساندویچ تن ماهی",
        },
        {
          name: "ساندویچ کباب",
          price: 145000,
          categoryId: catMap["ساندویچ"],
          order: 5,
          description: "ساندویچ کباب کوبیده",
        },

        // برگر
        {
          name: "برگر کلاسیک",
          price: 185000,
          categoryId: catMap["برگر"],
          image: "burger.jpeg",
          order: 1,
          description: "برگر گوشت با سبزیجات",
        },
        {
          name: "چیز برگر",
          price: 205000,
          categoryId: catMap["برگر"],
          order: 2,
          description: "برگر با پنیر ذوب شده",
        },
        {
          name: "چیکن برگر",
          price: 175000,
          categoryId: catMap["برگر"],
          order: 3,
          description: "برگر مرغ سوخاری",
        },
        {
          name: "فیش برگر",
          price: 165000,
          categoryId: catMap["برگر"],
          order: 4,
          description: "برگر ماهی",
        },
        {
          name: "دابل چیز برگر",
          price: 275000,
          categoryId: catMap["برگر"],
          order: 5,
          description: "برگر دو طبقه با پنیر",
        },

        // نوشیدنی گرم
        {
          name: "قهوه اسپرسو",
          price: 45000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 1,
          description: "اسپرسو تازه",
        },
        {
          name: "کاپوچینو",
          price: 55000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 2,
          description: "کاپوچینو خوشمزه",
        },
        {
          name: "لاته",
          price: 60000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 3,
          description: "لاته کرمی",
        },
        {
          name: "آمریکانو",
          price: 50000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 4,
          description: "قهوه آمریکانو",
        },
        {
          name: "چای",
          price: 25000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 5,
          description: "چای سیاه یا سبز",
        },
        {
          name: "هات چاکلت",
          price: 65000,
          categoryId: catMap["نوشیدنی گرم"],
          order: 6,
          description: "شکلات داغ",
        },

        // نوشیدنی سرد
        {
          name: "آب معدنی",
          price: 15000,
          categoryId: catMap["نوشیدنی سرد"],
          order: 1,
          description: "آب معدنی طبیعی",
        },
        {
          name: "نوشابه",
          price: 25000,
          categoryId: catMap["نوشیدنی سرد"],
          order: 2,
          description: "انواع نوشابه",
        },
        {
          name: "آب میوه طبیعی",
          price: 35000,
          categoryId: catMap["نوشیدنی سرد"],
          order: 3,
          description: "آب میوه تازه",
        },
        {
          name: "لیموناد",
          price: 45000,
          categoryId: catMap["نوشیدنی سرد"],
          order: 4,
          description: "لیموناد تازه",
        },
        {
          name: "آیس تی",
          price: 40000,
          categoryId: catMap["نوشیدنی سرد"],
          order: 5,
          description: "چای سرد",
        },

        // دسر
        {
          name: "تیرامیسو",
          price: 85000,
          categoryId: catMap["دسر"],
          order: 1,
          description: "تیرامیسوی ایتالیایی",
        },
        {
          name: "کیک شکلاتی",
          price: 75000,
          categoryId: catMap["دسر"],
          order: 2,
          description: "کیک شکلات تلخ",
        },
        {
          name: "بستنی وانیلی",
          price: 45000,
          categoryId: catMap["دسر"],
          order: 3,
          description: "بستنی وانیل طبیعی",
        },
        {
          name: "چیز کیک",
          price: 95000,
          categoryId: catMap["دسر"],
          order: 4,
          description: "چیز کیک خوشمزه",
        },
        {
          name: "بستنی شکلاتی",
          price: 50000,
          categoryId: catMap["دسر"],
          order: 5,
          description: "بستنی شکلات",
        },
      ];

      await prisma.menuItem.createMany({
        data: menuItems,
      });
      console.log("Menu items created");
    }

    return NextResponse.json({
      message: "Complete database seeded successfully!",
      categories: await prisma.category.count(),
      menuItems: await prisma.menuItem.count(),
      tables: await prisma.table.count(),
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      {
        error: "Seed failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
