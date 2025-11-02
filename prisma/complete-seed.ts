import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCompleteMenu() {
  console.log('پاک کردن داده‌های قبلی...');
  
  // پاک کردن داده‌های قبلی
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('وارد کردن دسته‌بندی‌ها و آیتم‌ها...');

  // دسته‌بندی‌ها و آیتم‌های کامل
  const categories = [
    {
      name: "پیش غذا",
      emoji: "🥗",
      order: 1,
      availableFrom: "10:00",
      availableTo: "23:00",
      items: [
        { name: "سالاد سزار", description: "کاهو، پارمزان، نان تست، سس سزار", price: 85000, image: "caesar-salad.jpg", order: 1 },
        { name: "سالاد فصل", description: "سبزیجات تازه فصل با سس مخصوص", price: 65000, image: "seasonal-salad.jpg", order: 2 },
        { name: "سوپ جو", description: "سوپ جو با سبزیجات و گوشت", price: 45000, order: 3 },
        { name: "سوپ مرغ", description: "سوپ مرغ با نودل و سبزیجات", price: 50000, order: 4 },
        { name: "سوپ قارچ", description: "سوپ کرمی قارچ", price: 48000, order: 5 },
        { name: "نان و پنیر", description: "نان تازه با پنیر محلی", price: 35000, order: 6 },
        { name: "کشک بادمجان", description: "بادمجان کبابی با کشک", price: 55000, order: 7 },
        { name: "میرزا قاسمی", description: "کشک بادمجان گیلانی", price: 60000, order: 8 },
        { name: "کوکو سبزی", description: "کوکو سبزی با گردو", price: 42000, order: 9 },
        { name: "بورانی اسفناج", description: "اسفناج با ماست و سیر", price: 38000, order: 10 }
      ]
    },
    {
      name: "صبحانه",
      emoji: "🍳",
      order: 2,
      availableFrom: "07:00",
      availableTo: "12:00",
      items: [
        { name: "املت ساده", description: "املت با تخم مرغ، نان و سبزیجات", price: 35000, image: "breakfast.jpg", order: 1 },
        { name: "املت قارچ", description: "املت با قارچ تازه و پنیر", price: 45000, order: 2 },
        { name: "املت اسفناج", description: "املت با اسفناج و پنیر فتا", price: 48000, order: 3 },
        { name: "کله پاچه", description: "کله پاچه سنتی با نان و سبزیجات", price: 55000, order: 4 },
        { name: "حلیم", description: "حلیم گندم با گوشت", price: 40000, order: 5 },
        { name: "آش رشته", description: "آش رشته با کشک و نعنا", price: 38000, order: 6 },
        { name: "نیمرو", description: "تخم مرغ نیمرو با نان", price: 25000, order: 7 },
        { name: "پنکیک", description: "پنکیک با عسل و کره", price: 42000, order: 8 },
        { name: "فرنچ تست", description: "نان فرنچ تست با تخم مرغ", price: 38000, order: 9 },
        { name: "صبحانه انگلیسی", description: "تخم مرغ، سوسیس، لوبیا، نان تست", price: 65000, order: 10 }
      ]
    },
    {
      name: "پیتزا ایتالیایی",
      emoji: "🍕",
      order: 3,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "مارگاریتا", description: "سس گوجه، موتزارلا، ریحان", price: 120000, image: "italian-pizza.jpg", order: 1 },
        { name: "پپرونی", description: "سس گوجه، موتزارلا، پپرونی", price: 135000, order: 2 },
        { name: "فور سیزن", description: "چهار قسمت با طعم‌های مختلف", price: 155000, order: 3 },
        { name: "وجترین", description: "سبزیجات تازه و پنیر موتزارلا", price: 125000, order: 4 },
        { name: "کاپریچوزا", description: "قارچ، ژامبون، آرتیچوک، زیتون", price: 145000, order: 5 },
        { name: "پریمیوم", description: "ترافل، پارمزان، آرگولا", price: 185000, order: 6 },
        { name: "دیاولا", description: "سالامی تند، فلفل قرمز، پیاز", price: 140000, order: 7 },
        { name: "ناپولی", description: "آنچوی، کپر، زیتون، گوجه", price: 138000, order: 8 }
      ]
    },
    {
      name: "پیتزا آمریکایی",
      emoji: "🍕",
      order: 4,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "چیکن BBQ", description: "مرغ باربیکیو، پیاز، فلفل", price: 145000, image: "american-pizza.jpg", order: 1 },
        { name: "میت لاورز", description: "انواع گوشت و کالباس", price: 165000, order: 2 },
        { name: "هاوایی", description: "ژامبون، آناناس، پنیر", price: 140000, order: 3 },
        { name: "سوپریم", description: "گوشت، سبزیجات، قارچ", price: 160000, order: 4 },
        { name: "چیکن رنچ", description: "مرغ، سس رنچ، ذرت", price: 142000, order: 5 },
        { name: "بوفالو چیکن", description: "مرغ تند، سلری، پنیر آبی", price: 148000, order: 6 },
        { name: "فیلی چیز", description: "گوشت، فلفل، پیاز، پنیر", price: 155000, order: 7 },
        { name: "پپر جک", description: "ژالاپینو، پپرونی، پنیر تند", price: 150000, order: 8 }
      ]
    },
    {
      name: "برگر",
      emoji: "🍔",
      order: 5,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "برگر کلاسیک", description: "گوشت، کاهو، گوجه، پیاز", price: 95000, image: "burger.jpeg", order: 1 },
        { name: "چیز برگر", description: "برگر کلاسیک با پنیر چدار", price: 105000, order: 2 },
        { name: "برگر مرغ", description: "فیله مرغ گریل شده", price: 85000, order: 3 },
        { name: "برگر ماهی", description: "فیله ماهی سوخاری", price: 90000, order: 4 },
        { name: "برگر وگن", description: "پتی گیاهی با سبزیجات", price: 80000, order: 5 },
        { name: "بیگ برگر", description: "دو لایه گوشت با پنیر", price: 125000, order: 6 },
        { name: "بیکن برگر", description: "گوشت، بیکن، پنیر چدار", price: 115000, order: 7 },
        { name: "مشروم برگر", description: "گوشت، قارچ، پنیر سوئیس", price: 110000, order: 8 },
        { name: "اونیون برگر", description: "گوشت، پیاز کرامه‌ای، پنیر", price: 108000, order: 9 },
        { name: "چیلی برگر", description: "گوشت، چیلی، پنیر مکزیکی", price: 118000, order: 10 }
      ]
    },
    {
      name: "پاستا",
      emoji: "🍝",
      order: 6,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "اسپاگتی کربونارا", description: "اسپاگتی با سس کرمی و بیکن", price: 110000, image: "pasta.jpg", order: 1 },
        { name: "پنه آرابیاتا", description: "پنه با سس گوجه تند", price: 95000, order: 2 },
        { name: "فتوچینی آلفردو", description: "فتوچینی با سس کرمی", price: 105000, order: 3 },
        { name: "لازانیا", description: "لازانیا با گوشت و پنیر", price: 125000, order: 4 },
        { name: "اسپاگتی بولونز", description: "اسپاگتی با سس گوشت", price: 115000, order: 5 },
        { name: "پنه پستو", description: "پنه با سس پستو و پارمزان", price: 108000, order: 6 },
        { name: "رزیتو قارچ", description: "رزیتو با قارچ پورچینی", price: 128000, order: 7 },
        { name: "نیوکی", description: "نیوکی سیب‌زمینی با سس گورگونزولا", price: 118000, order: 8 }
      ]
    },
    {
      name: "ساندویچ",
      emoji: "🥪",
      order: 7,
      availableFrom: "09:00",
      availableTo: "23:00",
      items: [
        { name: "کلاب ساندویچ", description: "مرغ، بیکن، کاهو، گوجه", price: 75000, image: "sandwich.jpg", order: 1 },
        { name: "ساندویچ تن", description: "تن ماهی، کاهو، خیارشور", price: 65000, order: 2 },
        { name: "ساندویچ مرغ", description: "فیله مرغ گریل با سبزیجات", price: 70000, order: 3 },
        { name: "ساندویچ کوکتل", description: "کالباس کوکتل با پنیر", price: 60000, order: 4 },
        { name: "رابن ساندویچ", description: "گوشت، کلم ترش، پنیر سوئیس", price: 78000, order: 5 },
        { name: "BLT ساندویچ", description: "بیکن، کاهو، گوجه", price: 68000, order: 6 },
        { name: "پانینی مرغ", description: "مرغ گریل، پنیر، سبزیجات", price: 72000, order: 7 },
        { name: "فیلی چیز", description: "گوشت، فلفل، پیاز، پنیر", price: 82000, order: 8 }
      ]
    },
    {
      name: "کباب",
      emoji: "🍖",
      order: 8,
      availableFrom: "12:00",
      availableTo: "23:00",
      items: [
        { name: "کباب کوبیده", description: "کباب کوبیده با برنج و سبزیجات", price: 130000, order: 1 },
        { name: "کباب برگ", description: "کباب برگ با برنج و گریل گوجه", price: 180000, order: 2 },
        { name: "کباب جوجه", description: "جوجه کباب با زعفران و برنج", price: 145000, order: 3 },
        { name: "کباب بختیاری", description: "ترکیب جوجه و برگ", price: 165000, order: 4 },
        { name: "کباب سلطانی", description: "ترکیب برگ و کوبیده", price: 195000, order: 5 },
        { name: "کباب ماهی", description: "ماهی قزل‌آلا با برنج", price: 155000, order: 6 },
        { name: "کباب میکس", description: "ترکیب انواع کباب", price: 220000, order: 7 },
        { name: "شیشلیک", description: "گوشت قوچ با استخوان", price: 175000, order: 8 }
      ]
    },
    {
      name: "غذاهای ایرانی",
      emoji: "🍛",
      order: 9,
      availableFrom: "12:00",
      availableTo: "22:00",
      items: [
        { name: "قیمه", description: "خورش قیمه با سیب‌زمینی و برنج", price: 85000, order: 1 },
        { name: "قورمه سبزی", description: "خورش قورمه سبزی با لوبیا قرمز", price: 90000, order: 2 },
        { name: "فسنجان", description: "خورش فسنجان با مرغ و انار", price: 95000, order: 3 },
        { name: "بامیه", description: "خورش بامیه با گوشت", price: 88000, order: 4 },
        { name: "کرفس", description: "خورش کرفس با گوشت", price: 92000, order: 5 },
        { name: "آلو اسفناج", description: "خورش آلو اسفناج با آلو", price: 87000, order: 6 },
        { name: "زرشک پلو", description: "برنج زرشک با مرغ", price: 98000, order: 7 },
        { name: "لوبیا پلو", description: "برنج لوبیا با گوشت", price: 95000, order: 8 },
        { name: "آدم پلو", description: "برنج باقلا شوید با گوشت", price: 105000, order: 9 },
        { name: "تاچین", description: "برنج ته‌دیگی با مرغ", price: 110000, order: 10 }
      ]
    },
    {
      name: "غذاهای بین‌المللی",
      emoji: "🌍",
      order: 10,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "چیکن کری", description: "مرغ کری با برنج هندی", price: 115000, order: 1 },
        { name: "پاد تای", description: "نودل تایلندی با میگو", price: 125000, order: 2 },
        { name: "سوشی میکس", description: "انواع سوشی ژاپنی", price: 185000, order: 3 },
        { name: "تاکو مکزیکی", description: "نان ذرت با گوشت و سبزیجات", price: 95000, order: 4 },
        { name: "مسقا یونانی", description: "بادمجان یونانی با گوشت", price: 105000, order: 5 },
        { name: "ریزوتو ایتالیایی", description: "برنج ایتالیایی با قارچ", price: 118000, order: 6 },
        { name: "پایا اسپانیولی", description: "برنج اسپانیولی با زعفران", price: 135000, order: 7 },
        { name: "فاهیتا مکزیکی", description: "گوشت مکزیکی با فلفل", price: 128000, order: 8 }
      ]
    },
    {
      name: "سالاد",
      emoji: "🥗",
      order: 11,
      availableFrom: "10:00",
      availableTo: "23:00",
      items: [
        { name: "سالاد یونانی", description: "گوجه، خیار، زیتون، فتا چیز", price: 85000, order: 1 },
        { name: "سالاد مرغ", description: "مرغ گریل، کاهو، گوجه چری", price: 95000, order: 2 },
        { name: "سالاد کینوا", description: "کینوا، سبزیجات، آجیل", price: 105000, order: 3 },
        { name: "سالاد میوه", description: "انواع میوه‌های تازه فصل", price: 65000, order: 4 },
        { name: "سالاد نیکویز", description: "تن ماهی، تخم مرغ، زیتون", price: 98000, order: 5 },
        { name: "سالاد والدورف", description: "سیب، گردو، کرفس، مایونز", price: 88000, order: 6 },
        { name: "سالاد کپری", description: "سیب‌زمینی، جعفری، سس کپری", price: 75000, order: 7 },
        { name: "سالاد آروگولا", description: "آروگولا، پارمزان، کرم بالزامیک", price: 92000, order: 8 }
      ]
    },
    {
      name: "دسر",
      emoji: "🍰",
      order: 12,
      availableFrom: "10:00",
      availableTo: "23:00",
      items: [
        { name: "تیرامیسو", description: "دسر ایتالیایی با قهوه", price: 55000, order: 1 },
        { name: "چیز کیک", description: "کیک پنیری با توت فرنگی", price: 50000, order: 2 },
        { name: "پاناکوتا", description: "دسر کرمی ایتالیایی", price: 45000, order: 3 },
        { name: "آیس کریم", description: "بستنی وانیلی، شکلاتی، توت فرنگی", price: 35000, order: 4 },
        { name: "کرم کارامل", description: "دسر کرمی با کارامل", price: 48000, order: 5 },
        { name: "چاکلت مولت", description: "کیک شکلاتی گرم", price: 58000, order: 6 },
        { name: "فیرنی", description: "دسر سنتی با گلاب", price: 38000, order: 7 },
        { name: "بستنی فالوده", description: "بستنی با نشاسته و گلاب", price: 42000, order: 8 },
        { name: "شیر برنج", description: "دسر شیر برنج با دارچین", price: 35000, order: 9 },
        { name: "باقلوا", description: "شیرینی فیلو با پسته", price: 45000, order: 10 }
      ]
    },
    {
      name: "نوشیدنی گرم",
      emoji: "☕",
      order: 13,
      availableFrom: "07:00",
      availableTo: "23:00",
      items: [
        { name: "قهوه اسپرسو", description: "قهوه اسپرسو اصیل", price: 25000, order: 1 },
        { name: "کاپوچینو", description: "قهوه با شیر و فوم", price: 30000, order: 2 },
        { name: "لاته", description: "قهوه با شیر داغ", price: 32000, order: 3 },
        { name: "آمریکانو", description: "قهوه اسپرسو با آب داغ", price: 28000, order: 4 },
        { name: "موکا", description: "قهوه با شکلات", price: 35000, order: 5 },
        { name: "چای سبز", description: "چای سبز معطر", price: 15000, order: 6 },
        { name: "چای سیاه", description: "چای سیاه مرغوب", price: 12000, order: 7 },
        { name: "چای ماسالا", description: "چای هندی با ادویه", price: 18000, order: 8 },
        { name: "هات چاکلت", description: "شکلات داغ با خامه", price: 25000, order: 9 },
        { name: "سحلب", description: "نوشیدنی داغ زمستانی", price: 22000, order: 10 }
      ]
    },
    {
      name: "نوشیدنی سرد",
      emoji: "🥤",
      order: 14,
      availableFrom: "07:00",
      availableTo: "23:00",
      items: [
        { name: "آب پرتقال", description: "آب پرتقال تازه", price: 20000, order: 1 },
        { name: "لیموناد", description: "آب لیمو با نعنا", price: 18000, order: 2 },
        { name: "آیس کافی", description: "قهوه سرد با یخ", price: 28000, order: 3 },
        { name: "اسموتی", description: "میکس میوه‌های تازه", price: 35000, order: 4 },
        { name: "نوشابه", description: "کوکا کولا، فانتا، اسپرایت", price: 18000, order: 5 },
        { name: "دوغ", description: "دوغ خانگی با نعنا", price: 12000, order: 6 },
        { name: "آب معدنی", description: "آب معدنی طبیعی", price: 8000, order: 7 },
        { name: "محلبات", description: "نوشیدنی سرد سنتی", price: 15000, order: 8 },
        { name: "شربت آلبالو", description: "شربت آلبالو خانگی", price: 16000, order: 9 },
        { name: "آیس تی", description: "چای سرد با لیمو", price: 22000, order: 10 }
      ]
    },
    {
      name: "فست فود",
      emoji: "🍟",
      order: 15,
      availableFrom: "11:00",
      availableTo: "02:00",
      items: [
        { name: "سیب‌زمینی سرخ‌کرده", description: "سیب‌زمینی کریسپی با نمک", price: 35000, image: "french-fries.jpg", order: 1 },
        { name: "چیکن استریپس", description: "استریپ مرغ سوخاری", price: 55000, image: "strips.jpg", order: 2 },
        { name: "ناگت مرغ", description: "ناگت مرغ با سس", price: 45000, order: 3 },
        { name: "پیتزا اسلایس", description: "یک تکه پیتزا", price: 25000, order: 4 },
        { name: "هات داگ", description: "سوسیس در نان با سس", price: 40000, order: 5 },
        { name: "کرن داگ", description: "سوسیس در خمیر ذرت", price: 38000, order: 6 },
        { name: "انیون رینگ", description: "حلقه پیاز سوخاری", price: 32000, order: 7 },
        { name: "موزارلا استیکس", description: "پنیر موزارلا سوخاری", price: 48000, order: 8 },
        { name: "جالپینو پاپرز", description: "فلفل جالپینو سوخاری", price: 42000, order: 9 },
        { name: "پوپ کورن چیکن", description: "مرغ ریز سوخاری", price: 50000, order: 10 }
      ]
    },
    {
      name: "سوخاری",
      emoji: "🍗",
      order: 16,
      availableFrom: "11:00",
      availableTo: "23:00",
      items: [
        { name: "مرغ سوخاری", description: "ران و بال مرغ سوخاری", price: 85000, order: 1 },
        { name: "فیله مرغ سوخاری", description: "فیله مرغ کریسپی", price: 75000, order: 2 },
        { name: "میگو سوخاری", description: "میگو درشت سوخاری", price: 125000, order: 3 },
        { name: "ماهی سوخاری", description: "فیله ماهی سوخاری", price: 95000, order: 4 },
        { name: "کالماری سوخاری", description: "حلقه کالماری سوخاری", price: 110000, order: 5 },
        { name: "سبزیجات سوخاری", description: "انواع سبزیجات سوخاری", price: 65000, order: 6 },
        { name: "قارچ سوخاری", description: "قارچ درشت سوخاری", price: 58000, order: 7 },
        { name: "پنیر حلومی سوخاری", description: "پنیر قبرسی سوخاری", price: 68000, order: 8 }
      ]
    }
  ];

  // ایجاد دسته‌بندی‌ها و آیتم‌ها
  for (const categoryData of categories) {
    const { items, ...categoryInfo } = categoryData;
    
    const category = await prisma.category.create({
      data: {
        ...categoryInfo,
        isActive: true,
      },
    });

    console.log(`دسته‌بندی "${category.name}" ایجاد شد`);

    // ایجاد آیتم‌های هر دسته‌بندی
    for (const item of items) {
      await prisma.menuItem.create({
        data: {
          ...item,
          categoryId: category.id,
          isActive: true,
        },
      });
    }

    console.log(`${items.length} آیتم برای دسته‌بندی "${category.name}" اضافه شد`);
  }

  console.log('✅ تمام داده‌ها با موفقیت وارد شد!');
  
  // آمار نهایی
  const totalCategories = await prisma.category.count();
  const totalItems = await prisma.menuItem.count();
  
  console.log(`📊 آمار نهایی:`);
  console.log(`   - دسته‌بندی‌ها: ${totalCategories}`);
  console.log(`   - آیتم‌ها: ${totalItems}`);
}

seedCompleteMenu()
  .catch((e) => {
    console.error('خطا در وارد کردن داده‌ها:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
