const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedRealGoogleSheetsData() {
  console.log('پاک کردن داده‌های قبلی...');
  
  // پاک کردن داده‌های قبلی
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  console.log('وارد کردن داده‌های واقعی Google Sheets...');

  // داده‌های واقعی از Google Sheets
  const rawData = [
    { recipe: "300 گرم سیب زمینی سرخ شده", price: 138, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سیب زمینی کلاسیک" },
    { recipe: "250 گرم سیب زمینی سرخ شده + سس دیپ", price: 265, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سیب زمینی با دیپ چدار" },
    { recipe: "250 گرم سیب زمینی سره شده + سس قارچ", price: 240, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سیب زمینی با سس قارچ" },
    { recipe: "300 گرم سیب زمینی سرخ شده + قارچ و پنیر + ژامبون", price: 275, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سیب زمینی ویژه" },
    { recipe: "سس سیر + پنیر پیتزا + خمیر 28 سانتی کاج", price: 190, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "نان سیر" },
    { recipe: "300 گرم کاهو + 200 گرم استیک مرغ + سس سزار", price: 356, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سالاد سزار گریل" },
    { recipe: "ناموجود", price: 390, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سالاد سزار سوخاری" },
    { recipe: "کاهو + اووکادو + توت فرنگی یا انار + اناناس", price: 345, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سالاد فرانسوی" },
    { recipe: "کاهو + سس پستو + گارنیش", price: 207, category: "پیش غذا", emoji: "🍟", image: "french-fries.jpg", title: "سالاد سبز" },
    
    { recipe: "بیکن + مرغ + قارچ و پنیر + خمیر 28 سانتی کاج + سس مخصوص", price: 437, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "کاج" },
    { recipe: "نان مخصوص کاج + سیب زیمینی با دیپ + قارچ و پنیر + مرغ طعم دار شده", price: 425, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "VIP سر آشپز" },
    { recipe: "پپرونی + ژامبون گوشت + مرغ + گوشت چرخ کرده + خمیر 28 سانتی کاج", price: 437, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "چهار فصل" },
    { recipe: "رست بیف + قارچ و پنیر + خمیر 28 سانتی کاج", price: 437, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "رست بیف" },
    { recipe: "مرغ + قارچ و پنیر پیتزا + خمیر 28 سانتی کاج", price: 345, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "مرغ و قارچ" },
    { recipe: "گوشت + قارچ و پنیر پیتزا + خمیر 28 سانتی کاج", price: 390, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "گوشت و قارچ" },
    { recipe: "استیک گوشت + ژامبون گوشت + سیب زمینی سرخ شده + قارچ و پنیر پیتزا", price: 345, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "مخصوص" },
    { recipe: "ژامبون گوشت + سوسیس آلمانی + قارچ و پنیر پیتزا + خمیر 28 سانتی کاج", price: 287, category: "پیتزا آمریکایی", emoji: "🍕🇺🇲", image: "american-pizza.jpg", title: "مخلوط" },
    
    { recipe: "استیک بوقلمون + قارچ و پنیر پیتزا + خمیر ایتالیایی", price: 402, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "استیک بوقلمون" },
    { recipe: "استیک راسته گوساله + قارچ و پنیر پیتزا + خمیر ایتالیایی", price: 437, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "سیر و استیک" },
    { recipe: "ژامبون پپرونی + هالوپینو + پنیر پیتزا + خمیر ایتالیایی", price: 322, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "پپرونی" },
    { recipe: "بیکن گوشت + مرغ + پنیر پیتزا + خمیر ایتالیایی", price: 414, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "بیکن استیک چیکن" },
    { recipe: "ماهی + میگو + سس مخصوص + خمیر ایتالیایی", price: 414, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "مدیترانه" },
    { recipe: "بادمجون + کدو + هویچ + بروکلی + پنیر پیتزا + خمیر ایتالیایی", price: 287, category: "پیتزا ایتالیایی", emoji: "🍕 🇮🇹", image: "italian-pizza.jpg", title: "سبزیجات" },
    
    { recipe: "زبان گوساله سوخاری شده + پنیر + نان مخصوص", price: 333, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "کاج" },
    { recipe: "رست بیف + بیکن + فیله مرغ + نان مخصوص", price: 391, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "سرآشپز" },
    { recipe: "سینه مرغ سوخاری + پنیر گودا + سیب زمینی سرخ شده + نان مخصوص", price: 264, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "زینگر" },
    { recipe: "فیله مرغ + قارچ و پنیر + نان مخصوص", price: 207, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "فیله ویژه" },
    { recipe: "گوشت گوساله رست شده + سس الفردو + نانا مخصوص", price: 299, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "رست بیف" },
    { recipe: "3 ورق ژامبون گوشت + قارچ و پنیر + سیب خلال + نان مخصوص", price: 276, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "ژامبون گئشت تنوری" },
    { recipe: "ژامبون تنوری + هات داگ + نان مخصوص", price: 230, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "هات داگ رویال" },
    { recipe: "یک عدد سوسیس کراکف پنیری 400 گرمی + نان مخصوص", price: 276, category: "ساندویچ", emoji: "🥪", image: "sandwich.jpg", title: "کراکف" },
    
    { recipe: "پنه + مرغ + سس الفردو + پنیر پارمسان", price: 299, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "چیکن الفردو" },
    { recipe: "پنه + سس الفردو + پنیر پارمسان", price: 448, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "بیف آلفردو" },
    { recipe: "پنه + مرغ + سس پستو + پنیر پارمسان", price: 299, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "چیکن پستو" },
    { recipe: "پنه + مرغ + سس آرابیتا + پنیر پارمسان", price: 264, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "مکزیکو" },
    { recipe: "پنه + سبزیجات + سس سبز + پنیر پارمسان", price: 218, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "سیسیلیانو" },
    { recipe: "پنه + میگو + سس مخصوص + پنیر پارمسان", price: 414, category: "پاستا", emoji: "🍝", image: "pasta.jpg", title: "میگو" },
    
    { recipe: "130 گرم گوشت + 2 عدد فیله مرغ + قارچ و پنیر + نان مخصوص", price: 379, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "کاج برگر" },
    { recipe: "130 گرم گوشت + نان مخصوص", price: 276, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "کلاسیک برگر" },
    { recipe: "130 گرم گوشت + پنیر گودا + پنیر چدار + نان مخصوص", price: 368, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "سرآشپز برگر" },
    { recipe: "130 گرم گوشت + پنیر گودا + نان مخصوص", price: 299, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "چیز برگر" },
    { recipe: "130 گرم گوشت + سس آلفردو + نان مخصوص", price: 356, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "ماشروم برگر" },
    { recipe: "2 عدد گوشت 130 گرمی + پنیر گودا + نان مخصوص", price: 448, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "دبل برگر" },
    { recipe: "130 گرم گوشت + سس باربیکیو + پیاز کاراملی + پنیر گودا + نان مخصوص", price: 310, category: "برگر", emoji: "🍔", image: "burger.jpeg", title: "باربیکیو برگر" },
    
    { recipe: "6 تیکه فیله مرغ + سیب زمینی + سالاد کلم + سس مخصوص + سبزیجات", price: 506, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "فیله استریپس 6 تیکه نرمال" },
    { recipe: "4 تیکه فیله مرغ + سیب زمینی + سالاد کلم + سس مخصوص", price: 391, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "فیله استریپس 4 تیکه نرمال" },
    { recipe: "6 حلقه پیاز سوخاری + سس مخصوص", price: 126, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "پیاز سوخاری" },
    { recipe: "150 گرم میگو + سس مخصوص", price: 448, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "میگو سوخاری" },
    { recipe: "6 عدد ناگت مرغ + سس مخصوص", price: 172, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "ناگت مرغ" },
    { recipe: "200 گرم قارچ + سس مخصوص", price: 126, category: "سوخاری", emoji: "🍗", image: "strips.jpg", title: "قارچ سوخاری" },
    
    { recipe: "250 گرم فیله گوساله + سبزیجات + سس مخصوص", price: 805, category: "استیک", emoji: "🥩", image: "stakes.jpg", title: "فیله مینیون" },
    { recipe: "400 گرم سینه مرغ + سبزیجات + سس مخصوص", price: 460, category: "استیک", emoji: "🥩", image: "stakes.jpg", title: "فیله مرغ" },
    { recipe: "500 گرم ریبای + سبزیجات + سس مخصوص", price: 805, category: "استیک", emoji: "🥩", image: "stakes.jpg", title: "ریپ آی (ریبای)" },
    
    { recipe: "پنیر + کره محلی + خامه + عسل + گوجه + خیار + گردو + خرما + چای", price: 172, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "بشقاب ایرانی" },
    { recipe: "سوسیس فرانفورت + نیمرو + لوبیا + بیکن گوشت قارچ + نان تست + سیب زمینی + گوجه چری + دورچین", price: 253, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "بشقاب انگلیسی" },
    { recipe: "جو دوسرپرک + شیر عسل + تاپینگ میوه فصل + کنجد + دارچین", price: 100, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "اوتمیل (رژیمی)" },
    { recipe: "2 عدد نان تست چند غله + کره بادام زمینی + پنیر لبنه + موز + کردو + گوجه چری + ریحان ایتالیایی", price: 200, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "مخصوص کاچ" },
    { recipe: "دو عدد تخم مرغ + سس گوجه فرنگی + دورچین + چای نبات", price: 70, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "املت" },
    { recipe: "", price: 70, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "املت فلفلی" },
    { recipe: "", price: 70, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "املت پنیری" },
    { recipe: "", price: 70, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "املت شاپوری" },
    { recipe: "", price: 80, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "نیمرو" },
    { recipe: "", price: 85, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "سوسیس تخم مرغ" },
    { recipe: "2 عدد تخم مرغ + 2 عدد نان تست + 1 ورق بیکن + کاهو + گوجه + پنیر گودا", price: 60, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "تست ساندویچ" },
    { recipe: "6 عدد پنکیک + سیروپ مخصوص + سس شکلات + توت فرنگی", price: 90, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "پنکیک" },
    { recipe: "", price: 70, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "خوارک عدسی" },
    { recipe: "", price: 80, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "خوراک لوبیا" },
    { recipe: "", price: 120, category: "صبحانه", emoji: "🍳", image: "breakfast.jpg", title: "نیمرو بیکن" },
    
    { recipe: "اسپرسو سینگل", price: 65, category: "قهوه", emoji: "🥃", image: "", title: "سولو" },
    { recipe: "اسپرسو دوبل", price: 80, category: "قهوه", emoji: "🥃", image: "", title: "دوپیو" },
    { recipe: "اسپرسو دوبل + اب جوش", price: 80, category: "قهوه", emoji: "🥃", image: "", title: "آمریکانو" },
    { recipe: "سیروپ شکلات + فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "موکـاچینو" },
    { recipe: "سیروپ کارامل + فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "کارامـل ماکیــاتو" },
    { recipe: "فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "لتـه" },
    { recipe: "سیروپ فندق +فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "لته فندق" },
    { recipe: "سیروپ نارگیل +فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "لته نارگیل" },
    { recipe: "سیروپ وانیل +فوم شیر + سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "لته وانیل" },
    { recipe: "پودر شکلات داغ +  فوم شیر +سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "کن لچه" },
    { recipe: "فوم شیر + شکر +سولو", price: 90, category: "قهوه", emoji: "🥃", image: "", title: "کاپوچینو" },
    
    { recipe: "دوپیو + یخ +آب", price: 80, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس آمریکانو" },
    { recipe: "سیروپ شکلات + شیر +یخ +سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس موکا" },
    { recipe: "سیروپ کارامل +شیر + یخ +سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس کارامل ماکیاتو" },
    { recipe: "شیر + یخ + سولو", price: 92, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس لته" },
    { recipe: "سیروپ فندق +شیر + یخ + سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس لته فندق" },
    { recipe: "سیروپ نارگیل + شیر + یخ + سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس لته نارگیل" },
    { recipe: "سیروپ نارگیل + شیر + یخ + سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آیس لته وانیل" },
    { recipe: "شیر + قهوه گلد + بستنی وانیل+خامه", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "گلاسه" },
    { recipe: "قهوه گلد + یخ + فوم شیر", price: 92, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "دالگونا" },
    { recipe: "سیروپ دلخواه شما + قهوه گلد + یخ + فوم شیر", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "دالگونا با سیروپ دلخواه شما" },
    { recipe: "بستنی وانیل + سولو", price: 103, category: "قهوه سرد", emoji: "🥃🧊", image: "", title: "آفـوگاتو" },
    
    { recipe: "پودر قهوه ترک + آب جوش", price: 64, category: "قهوه دمی", emoji: "🫖☕", image: "", title: "قهوه ترک" },
    { recipe: "قهوه  100عربیکا دم آوری شده (سه شات قهوه)", price: 161, category: "قهوه دمی", emoji: "🫖☕", image: "", title: "کمکس 3کاپ" },
    { recipe: "قهوه  100عربیکا دم آوری شده (شش شات قهوه)", price: 207, category: "قهوه دمی", emoji: "🫖☕", image: "", title: "کمکس 6کاپ" },
    { recipe: "قهوه  100عربیکا دم آوری شده", price: 100, category: "قهوه دمی", emoji: "🫖☕", image: "", title: "ایروپرس" },
    { recipe: "قهوه  100عربیکا دم آوری شده", price: 160, category: "قهوه دمی", emoji: "🫖☕", image: "", title: "وی شصت   V60" },
    
    { recipe: "یک لیوان چای سیاه به همراه نبات", price: 35, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "چای سیاه" },
    { recipe: "چای سبز (دم آوری شده با فرنچ پرس)+نبات", price: 45, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "چای سبز" },
    { recipe: "شیر + پودر ماسالا (زنجبیل+دارچین+میخک +هل +دارچین+فلفل سیاه)", price: 90, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "چای ماسالا" },
    { recipe: "شیر داغ", price: 35, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "شیر داغ" },
    { recipe: "شیر + عسل +دارچین", price: 45, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "شیر عسل دارچین" },
    { recipe: "شیر + پودر شکلات داغ", price: 90, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "هات چاکلت" },
    { recipe: "شیر + پودر شکلات سفید", price: 90, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "وایت چاکلت" },
    { recipe: "شیر + پودر شکلات داغ+خامه", price: 100, category: "نوشیدنی گرم", emoji: "🫖", image: "", title: "هات چاکلت ویژه" },
    
    { recipe: "تخم گشنیز+بهار نارنج +نعنا+چای ترش+میخک(دم آوری شده)", price: 70, category: "دمنوش", emoji: "🫖", image: "", title: "دمنوش 5 گیاه" },
    { recipe: "گل گاو زبان (دَم آوری شده)+نبات", price: 70, category: "دمنوش", emoji: "🫖", image: "", title: "دمنوش گل گاو زبان" },
    { recipe: "چای ترش( دَم آوری شده)", price: 70, category: "دمنوش", emoji: "🫖", image: "", title: "دمنوش کوئین بری" },
    { recipe: "سیب تازه + دارچین ( دَم آوری شده)نبات", price: 70, category: "دمنوش", emoji: "🫖", image: "", title: "دمنوش سیب دارچین" },
    
    { recipe: "لیمو + سیروپ سیمپل+ یخ + سودا", price: 80, category: "موکتل", emoji: "🍸", image: "", title: "لیموناد" },
    { recipe: "لیمو +نعنا + سیروپ سیمپل+ یخ + سودا", price: 92, category: "موکتل", emoji: "🍸", image: "", title: "موهیتو" },
    { recipe: "لیمو + نعنا +یخ +سیروپ البالو+سودا", price: 103, category: "موکتل", emoji: "🍸", image: "", title: "رد موهیتو" },
    { recipe: "لیمو + نعنا +یخ + سیروپ بلوکاراسائو +سودا", price: 103, category: "موکتل", emoji: "🍸", image: "", title: "بلو موهیتو" },
    { recipe: "ترکیب  بلو و رد موهیتو", price: 105, category: "موکتل", emoji: "🍸", image: "", title: "میکس موهیتو" },
    { recipe: "فلفل سیاه+ نمک+اسید خوراکی+ اب البالو + سیروپ سماق و چای ترش +ابلیمو +آب پرتغال+آب انگور", price: 115, category: "موکتل", emoji: "🍸", image: "", title: "اولد من" },
    { recipe: "خیار تازه + شربت سکنجبین+  سودا", price: 80, category: "موکتل", emoji: "🍸", image: "", title: "خیارسکنجبین" },
    { recipe: "سکنجبین +بهارنارنج+پنیرک +سیروپ بلو کاراسائو+تخم شربتی+ خاکشیر+زعفران+گلاب+بیدمشک", price: 80, category: "موکتل", emoji: "🍸", image: "", title: "شربت عرقیجات" },
    { recipe: "میوه سیب + پرتغال + سیروپ رام + آبمیوه سیب +آبمیوه پرتغال", price: 150, category: "موکتل", emoji: "🍸", image: "", title: "سنگریا" },
    
    { recipe: "بستنی موز+بستنی توت فرنگی+سیروپ توت فرنگی +موز +یخ", price: 115, category: "اسموتی", emoji: "🍹", image: "", title: "موز توت فرنگی" },
    { recipe: "شاتوت +انار+آلبالو+ابلیمو+اب انار+لیمو", price: 115, category: "اسموتی", emoji: "🍹", image: "", title: "ردمیکس" },
    { recipe: "توت فرنگی +هندونه+نعنا+لایم سودا+یخ", price: 115, category: "اسموتی", emoji: "🍹", image: "", title: "می آمور" },
    { recipe: "لیمو+پرتغال+آناناس+آب انبه +آب پرتغال+آب اناناس", price: 115, category: "اسموتی", emoji: "🍹", image: "", title: "ریو" },
    
    { recipe: "بستنی موز+بستنی شکلات +شیر", price: 150, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک  موز شکلات" },
    { recipe: "بستنی وانیل +نوتلا+شیر", price: 172, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک نوتلا" },
    { recipe: "بستنی وانیل +شیر +یه شات اسپرسو", price: 150, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک قهوه" },
    { recipe: "بستنی وانیل +بیسکوییت لوتوس +کره لوتوس+شیر", price: 172, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک لوتوس" },
    { recipe: "بستنی وانیل +بادام زمینی + کره بادام زمینی + شیر", price: 162, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک بادام زمینی" },
    { recipe: "بستنی توت فرنگی +سیروپ توت فرنگی + نوتلا +شیر", price: 172, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک توت فرنگی نوتلا" },
    { recipe: "بستنی اسنیکرز + کیک اسنیکرز + شیر", price: 162, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک اسنیکرز" },
    { recipe: "بستنی وانیل +کیک اورئو+ شیر", price: 150, category: "میلک شیک", emoji: "🧋", image: "", title: "شیک اورئو" },
    
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "انگور" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "انبه" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "بلوبری" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "آلو یخ" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "هندوانه یخ" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "سیب یخ" },
    { recipe: "", price: 140, category: "قلیان میوه ای", emoji: "🚬", image: "", title: "پرتغال خامه" },
    
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "مرلین مونرو" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "لاو" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "شبهای مسکو" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "گادفادر" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "تمشک بستنی" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "هاوانا" },
    { recipe: "", price: 140, category: "قلیان میکس", emoji: "🚬", image: "", title: "دوسیب" },
    
    { recipe: "", price: 120, category: "قلیان چوبی", emoji: "🚬", image: "", title: "دوسیب آلبالو" },
    { recipe: "", price: 120, category: "قلیان چوبی", emoji: "🚬", image: "", title: "آدامس دارچین" },
    { recipe: "", price: 140, category: "قلیان چوبی", emoji: "🚬", image: "", title: "لیمو نعنا" },
    { recipe: "", price: 140, category: "قلیان چوبی", emoji: "🚬", image: "", title: "پرتغال نعنا" },
    { recipe: "", price: 140, category: "قلیان چوبی", emoji: "🚬", image: "", title: "شیر قهوه" },
    
    { recipe: "سه اسکوپ بستنی +خامه+ژله+آناناس+ترافل", price: 138, category: "دسر و کیک", emoji: "🎂", image: "", title: "رویال بستنی" },
    { recipe: "نــاموجود", price: 70, category: "دسر و کیک", emoji: "🎂", image: "", title: "کیک شکلات خامه ای" },
    { recipe: "", price: 75, category: "دسر و کیک", emoji: "🎂", image: "", title: "کیک موکا" },
    { recipe: "", price: 80, category: "دسر و کیک", emoji: "🎂", image: "", title: "تیرامیسو" }
  ];

  // گروه‌بندی داده‌ها بر اساس دسته‌بندی
  const categoriesMap = new Map();
  
  rawData.forEach(item => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, {
        name: item.category,
        emoji: item.emoji,
        items: []
      });
    }
    categoriesMap.get(item.category).items.push(item);
  });

  // ایجاد دسته‌بندی‌ها و آیتم‌ها
  let categoryOrder = 1;
  for (const [categoryName, categoryData] of categoriesMap) {
    const category = await prisma.category.create({
      data: {
        name: categoryData.name,
        emoji: categoryData.emoji,
        order: categoryOrder++,
        isActive: true,
        availableFrom: "09:00",
        availableTo: "23:00",
      },
    });

    console.log(`دسته‌بندی "${category.name}" ایجاد شد`);

    // ایجاد آیتم‌های هر دسته‌بندی
    let itemOrder = 1;
    for (const item of categoryData.items) {
      await prisma.menuItem.create({
        data: {
          name: item.title,
          description: item.recipe || item.title,
          price: item.price * 1000, // تبدیل به ریال
          image: item.image || null,
          order: itemOrder++,
          categoryId: category.id,
          isActive: true,
        },
      });
    }

    console.log(`${categoryData.items.length} آیتم برای دسته‌بندی "${category.name}" اضافه شد`);
  }

  console.log('✅ تمام داده‌های واقعی Google Sheets با موفقیت وارد شد!');
  
  // آمار نهایی
  const totalCategories = await prisma.category.count();
  const totalItems = await prisma.menuItem.count();
  
  console.log(`📊 آمار نهایی:`);
  console.log(`   - دسته‌بندی‌ها: ${totalCategories}`);
  console.log(`   - آیتم‌ها: ${totalItems}`);
}

seedRealGoogleSheetsData()
  .catch((e) => {
    console.error('خطا در وارد کردن داده‌ها:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
