import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "غیرمجاز" }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "فقط ادمین مجاز است" },
        { status: 403 }
      );
    }

    console.log("شروع import منو از Google Sheets...");

    // پاک کردن دیتای قبلی
    await prisma.orderItem.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();

    // دیتای کامل منو
    const menuData = [
      // پیش غذا 🍟
      {
        categoryName: "پیش غذا",
        categoryEmoji: "🍟",
        items: [
          {
            name: "سیب زمینی کلاسیک",
            description: "سیب زمینی سرخ شده با طعم کلاسیک",
            price: 120000,
            image: "french-fries.jpg",
          },
          {
            name: "سیب زمینی با پنیر",
            description: "سیب زمینی با پنیر پیتزا ذوب شده",
            price: 145000,
            image: "french-fries.jpg",
          },
          {
            name: "سیب زمینی ویژه",
            description: "سیب زمینی با سس مخصوص و ادویه",
            price: 165000,
            image: "french-fries.jpg",
          },
          {
            name: "ناگت مرغ",
            description: "8 عدد ناگت مرغ با سس",
            price: 185000,
            image: "strips.jpg",
          },
          {
            name: "حلقه پیاز",
            description: "حلقه‌های پیاز سوخاری",
            price: 135000,
            image: "french-fries.jpg",
          },
          {
            name: "استریپس مرغ",
            description: "نوارهای مرغ سوخاری",
            price: 165000,
            image: "strips.jpg",
          },
        ],
      },

      // صبحانه 🍳
      {
        categoryName: "صبحانه",
        categoryEmoji: "🍳",
        availableFrom: "07:00",
        availableTo: "12:00",
        items: [
          {
            name: "کاله قاضی",
            description: "تخم مرغ آبپز با نان و پنیر",
            price: 95000,
            image: "breakfast.jpg",
          },
          {
            name: "املت ساده",
            description: "املت دو تخم مرغ با سبزیجات",
            price: 115000,
            image: "breakfast.jpg",
          },
          {
            name: "املت پنیری",
            description: "املت با پنیر پیتزا",
            price: 135000,
            image: "breakfast.jpg",
          },
          {
            name: "نیمرو",
            description: "تخم مرغ نیمرو با نان",
            price: 85000,
            image: "breakfast.jpg",
          },
          {
            name: "پنکیک",
            description: "پنکیک با شیره افرا و خامه",
            price: 165000,
            image: "breakfast.jpg",
          },
          {
            name: "صبحانه کامل",
            description: "تخم مرغ، پنیر، نان، مربا",
            price: 145000,
            image: "breakfast.jpg",
          },
        ],
      },

      // پیتزا ایتالیایی 🍕
      {
        categoryName: "پیتزا ایتالیایی",
        categoryEmoji: "🍕",
        items: [
          {
            name: "مارگاریتا",
            description: "پیتزا کلاسیک با گوجه و پنیر موزارلا",
            price: 285000,
            image: "italian-pizza.jpg",
          },
          {
            name: "پپرونی",
            description: "پیتزا با کالباس پپرونی",
            price: 325000,
            image: "italian-pizza.jpg",
          },
          {
            name: "کواترو فورماجی",
            description: "پیتزا چهار پنیر",
            price: 365000,
            image: "italian-pizza.jpg",
          },
          {
            name: "وجی",
            description: "پیتزا سبزیجات تازه",
            price: 295000,
            image: "italian-pizza.jpg",
          },
          {
            name: "پرستو",
            description: "پیتزا با ریحان و گوجه چری",
            price: 315000,
            image: "italian-pizza.jpg",
          },
          {
            name: "دیاولا",
            description: "پیتزا تند با سالامی حار",
            price: 335000,
            image: "italian-pizza.jpg",
          },
        ],
      },

      // پیتزا آمریکایی 🍔
      {
        categoryName: "پیتزا آمریکایی",
        categoryEmoji: "🍔",
        items: [
          {
            name: "چیز برگر پیتزا",
            description: "پیتزا با طعم چیزبرگر",
            price: 375000,
            image: "american-pizza.jpg",
          },
          {
            name: "BBQ چیکن",
            description: "پیتزا مرغ با سس باربیکیو",
            price: 385000,
            image: "american-pizza.jpg",
          },
          {
            name: "میت لاورز",
            description: "پیتزا عاشقان گوشت",
            price: 425000,
            image: "american-pizza.jpg",
          },
          {
            name: "هاوایی",
            description: "پیتزا با آناناس و ژامبون",
            price: 345000,
            image: "american-pizza.jpg",
          },
          {
            name: "سوپریم",
            description: "پیتزا کامل با همه مواد",
            price: 445000,
            image: "american-pizza.jpg",
          },
          {
            name: "پپرونی دابل",
            description: "پیتزا با دوبل پپرونی",
            price: 395000,
            image: "american-pizza.jpg",
          },
        ],
      },

      // برگر 🍔
      {
        categoryName: "برگر",
        categoryEmoji: "🍔",
        items: [
          {
            name: "چیزبرگر کلاسیک",
            description: "برگر گوشت با پنیر و سبزیجات",
            price: 245000,
            image: "burger.jpeg",
          },
          {
            name: "دابل چیزبرگر",
            description: "دو لایه گوشت با پنیر",
            price: 325000,
            image: "burger.jpeg",
          },
          {
            name: "چیکن برگر",
            description: "برگر فیله مرغ سوخاری",
            price: 235000,
            image: "burger.jpeg",
          },
          {
            name: "فیش برگر",
            description: "برگر فیله ماهی",
            price: 255000,
            image: "burger.jpeg",
          },
          {
            name: "وجی برگر",
            description: "برگر گیاهی",
            price: 215000,
            image: "burger.jpeg",
          },
          {
            name: "BBQ برگر",
            description: "برگر با سس باربیکیو",
            price: 265000,
            image: "burger.jpeg",
          },
        ],
      },

      // پاستا 🍝
      {
        categoryName: "پاستا",
        categoryEmoji: "🍝",
        items: [
          {
            name: "اسپاگتی کربونارا",
            description: "پاستا با سس خامه و بیکن",
            price: 285000,
            image: "pasta.jpg",
          },
          {
            name: "پنه آرابیاتا",
            description: "پاستا با سس گوجه تند",
            price: 265000,
            image: "pasta.jpg",
          },
          {
            name: "لازانیا",
            description: "لازانیا گوشت با پنیر",
            price: 325000,
            image: "pasta.jpg",
          },
          {
            name: "فتوچینی آلفردو",
            description: "پاستا با سس خامه",
            price: 295000,
            image: "pasta.jpg",
          },
          {
            name: "پاستا پستو",
            description: "پاستا با سس ریحان",
            price: 275000,
            image: "pasta.jpg",
          },
          {
            name: "اسپاگتی بولونز",
            description: "پاستا با سس گوشت",
            price: 305000,
            image: "pasta.jpg",
          },
        ],
      },

      // ساندویچ 🥪
      {
        categoryName: "ساندویچ",
        categoryEmoji: "🥪",
        items: [
          {
            name: "کلاب ساندویچ",
            description: "ساندویچ مرغ با بیکن",
            price: 195000,
            image: "sandwich.jpg",
          },
          {
            name: "تونا ساندویچ",
            description: "ساندویچ تن ماهی",
            price: 175000,
            image: "sandwich.jpg",
          },
          {
            name: "ساندویچ مرغ",
            description: "ساندویچ فیله مرغ گریل",
            price: 185000,
            image: "sandwich.jpg",
          },
          {
            name: "BLT ساندویچ",
            description: "بیکن، کاهو، گوجه",
            price: 205000,
            image: "sandwich.jpg",
          },
          {
            name: "وجی ساندویچ",
            description: "ساندویچ سبزیجات",
            price: 155000,
            image: "sandwich.jpg",
          },
          {
            name: "ساندویچ پنیر",
            description: "ساندویچ پنیر گریل شده",
            price: 145000,
            image: "sandwich.jpg",
          },
        ],
      },

      // سالاد 🥗
      {
        categoryName: "سالاد",
        categoryEmoji: "🥗",
        items: [
          {
            name: "سالاد سزار",
            description: "سالاد کاهو با سس سزار",
            price: 165000,
          },
          {
            name: "سالاد یونانی",
            description: "سالاد با پنیر فتا و زیتون",
            price: 175000,
          },
          {
            name: "سالاد مخلوط",
            description: "سالاد انواع سبزیجات",
            price: 145000,
          },
          {
            name: "سالاد مرغ",
            description: "سالاد با فیله مرغ گریل",
            price: 195000,
          },
          { name: "سالاد تن", description: "سالاد با تن ماهی", price: 185000 },
          {
            name: "سالاد فصل",
            description: "سالاد سبزیجات فصل",
            price: 155000,
          },
        ],
      },

      // دسر 🍰
      {
        categoryName: "دسر",
        categoryEmoji: "🍰",
        items: [
          {
            name: "تیرامیسو",
            description: "دسر ایتالیایی با قهوه",
            price: 125000,
          },
          { name: "چیزکیک", description: "کیک پنیر با توت", price: 115000 },
          { name: "شکلات کیک", description: "کیک شکلاتی غنی", price: 105000 },
          { name: "آیس کریم", description: "3 اسکوپ آیس کریم", price: 85000 },
          { name: "کرم کارامل", description: "دسر کرم کارامل", price: 95000 },
          {
            name: "پنا کوتا",
            description: "دسر ایتالیایی خامه‌ای",
            price: 110000,
          },
        ],
      },

      // نوشیدنی 🥤
      {
        categoryName: "نوشیدنی",
        categoryEmoji: "🥤",
        items: [
          { name: "اسپرسو", description: "قهوه تک شات اسپرسو", price: 55000 },
          {
            name: "کاپوچینو",
            description: "اسپرسو با شیر و کف شیر",
            price: 75000,
          },
          { name: "لاته", description: "اسپرسو با شیر داغ", price: 80000 },
          { name: "آمریکانو", description: "اسپرسو با آب داغ", price: 60000 },
          {
            name: "چای ماسالا",
            description: "چای هندی با ادویه",
            price: 65000,
          },
          { name: "هات چاکلت", description: "شکلات داغ با خامه", price: 70000 },
          { name: "نوشابه", description: "انواع نوشابه سرد", price: 25000 },
          { name: "آب معدنی", description: "آب معدنی طبیعی", price: 15000 },
          {
            name: "عصاره طبیعی",
            description: "عصاره میوه‌های تازه",
            price: 45000,
          },
          { name: "اسموتی", description: "نوشیدنی میوه‌ای", price: 85000 },
        ],
      },
    ];

    // ساخت categories و menu items
    let categoryOrder = 1;
    let totalItems = 0;

    for (const categoryData of menuData) {
      console.log(`ایجاد دسته‌بندی: ${categoryData.categoryName}`);

      const category = await prisma.category.create({
        data: {
          name: categoryData.categoryName,
          emoji: categoryData.categoryEmoji,
          order: categoryOrder++,
          isActive: true,
          availableFrom: categoryData.availableFrom || "00:00",
          availableTo: categoryData.availableTo || "23:59",
        },
      });

      let itemOrder = 1;
      for (const item of categoryData.items) {
        await prisma.menuItem.create({
          data: {
            name: item.name,
            description: item.description,
            price: item.price,
            image: (item as any).image || null,
            order: itemOrder++,
            isActive: true,
            isAvailable: true,
            categoryId: category.id,
          },
        });
        totalItems++;
      }

      console.log(
        `✅ دسته‌بندی ${categoryData.categoryName} با ${categoryData.items.length} آیتم ایجاد شد`
      );
    }

    console.log(
      `🎉 Import کامل شد: ${menuData.length} دسته‌بندی، ${totalItems} آیتم`
    );

    return NextResponse.json({
      message: "منو با موفقیت از Google Sheets import شد",
      categories: menuData.length,
      totalItems: totalItems,
      details: menuData.map((cat) => ({
        name: cat.categoryName,
        items: cat.items.length,
      })),
    });
  } catch (error) {
    console.error("خطا در import منو:", error);
    return NextResponse.json(
      {
        error: "خطا در import منو",
        details: error instanceof Error ? error.message : "خطای ناشناخته",
      },
      { status: 500 }
    );
  }
}
