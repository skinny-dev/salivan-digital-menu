"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Eye } from "lucide-react";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

interface Category {
  name: string;
  emoji: string;
  availableFrom?: string;
  availableTo?: string;
  items: MenuItem[];
}

export default function GoogleSheetsPreview() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isImporting, setIsImporting] = useState(false);

  // داده‌های Google Sheets - نسخه کامل
  // لطفاً داده‌های کامل خود را اینجا قرار دهید
  const googleSheetsData: Category[] = [
    {
      name: "پیش غذا",
      emoji: "🥗",
      availableFrom: "10:00",
      availableTo: "23:00",
      items: [
        {
          name: "سالاد سزار",
          description: "کاهو، پارمزان، نان تست، سس سزار",
          price: 85000,
          image: "caesar-salad.jpg",
          category: "پیش غذا",
        },
        {
          name: "سالاد فصل",
          description: "سبزیجات تازه فصل با سس مخصوص",
          price: 65000,
          image: "seasonal-salad.jpg",
          category: "پیش غذا",
        },
        {
          name: "سوپ جو",
          description: "سوپ جو با سبزیجات و گوشت",
          price: 45000,
          category: "پیش غذا",
        },
        {
          name: "سوپ مرغ",
          description: "سوپ مرغ با نودل و سبزیجات",
          price: 50000,
          category: "پیش غذا",
        },
        {
          name: "سوپ قارچ",
          description: "سوپ کرمی قارچ",
          price: 48000,
          category: "پیش غذا",
        },
        {
          name: "نان و پنیر",
          description: "نان تازه با پنیر محلی",
          price: 35000,
          category: "پیش غذا",
        },
        {
          name: "کشک بادمجان",
          description: "بادمجان کبابی با کشک",
          price: 55000,
          category: "پیش غذا",
        },
        {
          name: "میرزا قاسمی",
          description: "کشک بادمجان گیلانی",
          price: 60000,
          category: "پیش غذا",
        },
      ],
    },
    {
      name: "صبحانه",
      emoji: "�",
      availableFrom: "07:00",
      availableTo: "12:00",
      items: [
        {
          name: "املت ساده",
          description: "املت با تخم مرغ، نان و سبزیجات",
          price: 35000,
          image: "breakfast.jpg",
          category: "صبحانه",
        },
        {
          name: "املت قارچ",
          description: "املت با قارچ تازه و پنیر",
          price: 45000,
          category: "صبحانه",
        },
        {
          name: "کله پاچه",
          description: "کله پاچه سنتی با نان و سبزیجات",
          price: 55000,
          category: "صبحانه",
        },
        {
          name: "حلیم",
          description: "حلیم گندم با گوشت",
          price: 40000,
          category: "صبحانه",
        },
        {
          name: "آش رشته",
          description: "آش رشته با کشک و نعنا",
          price: 38000,
          category: "صبحانه",
        },
        {
          name: "نیمرو",
          description: "تخم مرغ نیمرو با نان",
          price: 25000,
          category: "صبحانه",
        },
        {
          name: "پنکیک",
          description: "پنکیک با عسل و کره",
          price: 42000,
          category: "صبحانه",
        },
        {
          name: "فرنچ تست",
          description: "نان فرنچ تست با تخم مرغ",
          price: 38000,
          category: "صبحانه",
        },
      ],
    },
    // ... ادامه دسته‌بندی‌ها
    // لطفاً داده‌های کامل 15+ دسته‌بندی و 152 آیتم خود را اینجا اضافه کنید
  ];

  const getAllItems = () => {
    return googleSheetsData.flatMap((category) =>
      category.items.map((item) => ({ ...item, categoryInfo: category }))
    );
  };

  const getFilteredItems = () => {
    if (selectedCategory === "all") {
      return getAllItems();
    }
    const category = googleSheetsData.find(
      (cat) => cat.name === selectedCategory
    );
    return category
      ? category.items.map((item) => ({ ...item, categoryInfo: category }))
      : [];
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch("/api/admin/import-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("منو با موفقیت وارد شد!");
        router.push("/dashboard/admin/menu");
      } else {
        const error = await response.json();
        alert("خطا در وارد کردن منو: " + error.error);
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور");
    } finally {
      setIsImporting(false);
    }
  };

  const filteredItems = getFilteredItems();
  const totalItems = getAllItems().length;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">
                پیش‌نمایش داده‌های Google Sheets
              </h1>
              <p className="text-zinc-400">
                {googleSheetsData.length} دسته‌بندی • {totalItems} آیتم
              </p>
            </div>
          </div>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download size={20} />
            <span>
              {isImporting ? "در حال وارد کردن..." : "وارد کردن به دیتابیس"}
            </span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === "all"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              همه ({totalItems})
            </button>
            {googleSheetsData.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === category.name
                    ? "bg-green-600 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                <span>{category.emoji}</span>
                <span>
                  {category.name} ({category.items.length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-700">
                <tr>
                  <th className="text-right p-4 font-medium">نام</th>
                  <th className="text-right p-4 font-medium">دسته‌بندی</th>
                  <th className="text-right p-4 font-medium">توضیحات</th>
                  <th className="text-right p-4 font-medium">قیمت</th>
                  <th className="text-right p-4 font-medium">تصویر</th>
                  <th className="text-right p-4 font-medium">ساعات دسترسی</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-zinc-700 hover:bg-zinc-750"
                  >
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-700 text-sm">
                        <span>{item.categoryInfo.emoji}</span>
                        <span>{item.category}</span>
                      </span>
                    </td>
                    <td className="p-4 text-zinc-300 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="p-4 font-medium text-green-400">
                      {item.price.toLocaleString()} تومان
                    </td>
                    <td className="p-4">
                      {item.image ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-zinc-600 rounded overflow-hidden">
                            <img
                              src={`/images/${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                          <span className="text-sm text-zinc-400">
                            {item.image}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-500 text-sm">ندارد</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">
                      {item.categoryInfo.availableFrom &&
                      item.categoryInfo.availableTo
                        ? `${item.categoryInfo.availableFrom} - ${item.categoryInfo.availableTo}`
                        : "همیشه"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-zinc-400">آیتمی یافت نشد</div>
        )}
      </div>
    </div>
  );
}
