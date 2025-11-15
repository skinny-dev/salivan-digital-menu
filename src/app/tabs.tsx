"use client";
import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Papa from "papaparse";
import { Skeleton } from "./components/ui/skeleton";
import LoadingImage from "./components/loadingImage";
import { resolveMenuImageSrc } from "./lib/utils";

// Define a type for spreadsheet rows
type MenuItem = Record<string, string>;

// Helper to read from multiple possible column names
function getField(row: MenuItem, keys: string[]): string {
  for (const k of keys) {
    const v = (row[k] ?? "").toString().trim();
    if (v) return v;
  }
  return "";
}

// Group by icon+name
function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  const groups: Record<string, MenuItem[]> = {};
  items.forEach((item) => {
    // Use both trimmed icon and name as key, trimming whitespace
    const icon = getField(item, [
      "آیکون دسته‌بندی",
      "آیکون دسته بندی",
      "آیکون دست بندی",
    ]);
    const name = getField(item, ["نام دسته‌بندی", "نام دسته بندی"]);
    const key = `${icon}|${name}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
}

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1psa3fMSqiPUKSAJ3QytZg5Iw7KvxMhVdwYccx014hKU/export?format=tsv&gid=0";

export default function TabsExample() {
  const [tabs, setTabs] = useState<
    {
      icon: string;
      name: string;
      value: string;
      items: MenuItem[];
      hasSpecial?: boolean;
      specialPrice?: number;
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(SHEET_CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const result = Papa.parse<MenuItem>(text, {
          header: true,
          delimiter: "\t",
          skipEmptyLines: true,
        });
        const items: MenuItem[] = result.data;
        const grouped = groupByCategory(items);
        const tabArr = Object.entries(grouped).map(([cat, items], idx) => {
          const [icon, name] = cat.split("|");
          // Detect special (ویژه) capability and read special price (قیمت ویژه)
          const specialItems = items.filter(
            (it) => (it["ویژه"] || "").toString().trim() === "1"
          );
          const specialPriceRaw = specialItems.find(
            (it) => (it["قیمت ویژه"] || "").toString().trim() !== ""
          )?.["قیمت ویژه"]; // may be like 60
          const specialPrice = specialPriceRaw
            ? Number((specialPriceRaw as string).replace(/[^\d.]/g, ""))
            : undefined;
          return {
            icon,
            name,
            value: `tab${idx}`,
            items,
            hasSpecial: specialItems.length > 0,
            specialPrice,
          };
        });
        setTabs(tabArr);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading menu:", error);
        setIsLoading(false);
      });
  }, []);

  // Auto-scroll tab list to show the default (first) tab on the right
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (tabs.length && listRef.current) {
      // Scroll to end (rightmost) to show first tab in RTL
      listRef.current.scrollLeft = listRef.current.scrollWidth;
    }
  }, [tabs]);

  if (isLoading) {
    return (
      <div className="p-4" dir="rtl">
        {/* Tabs skeleton - exact same layout */}
        <div className="flex gap-2 mb-6 overflow-x-auto h-fit">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col h-fit flex-shrink-0">
              {/* Icon skeleton - text-2xl */}
              <Skeleton className="w-8 h-8 rounded mb-1 mx-auto" />
              {/* Name skeleton - text-base */}
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          ))}
        </div>

        {/* Menu items skeleton - exact same responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-row items-center justify-between rounded-2xl bg-orange-950/20 p-4 gap-4 shadow-none"
            >
              {/* Image skeleton - exact same size */}
              <Skeleton className="rounded-full border-2 border-[#232323] w-[80px] h-[80px] flex-shrink-0" />

              {/* Text content skeleton - exact same layout */}
              <div className="flex flex-col flex-1 gap-1 items-start text-start">
                {/* Title skeleton - text-base font-bold */}
                <Skeleton className="h-5 w-32 mb-1" />
                {/* Description skeleton - text-xs */}
                <Skeleton className="h-3 w-48 mb-1" />
                <div className="flex justify-between w-full">
                  {/* Price skeleton - text-lg font-bold */}
                  <Skeleton className="h-6 w-24" />
                  {/* QuantitySelector skeleton - exact same size */}
                  <Skeleton className="h-10 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!tabs.length) return <div className="p-4">خطا در بارگزاری منو</div>;

  return (
    <Tabs
      key={tabs[0]?.value} // <-- force remount when tabs change
      defaultValue={tabs[0].value}
      className="w-full mx-auto mt-2 h-fit"
      dir="rtl"
    >
      <TabsList ref={listRef} className="h-fit">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex flex-col h-fit"
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-base">{tab.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          dir="rtl"
          className="p-2"
        >
          <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-[white] text-xl font-bold flex items-center gap-2">
              <span>{tab.name}</span>
              <span className="text-2xl">{tab.icon}</span>
            </div>
            {tab.hasSpecial && (
              <div className="flex items-center gap-2 md:ml-auto">
                <span className="text-xs md:text-sm text-orange-300 bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1 whitespace-nowrap">
                  {typeof tab.specialPrice === "number" &&
                  !Number.isNaN(tab.specialPrice)
                    ? `ویژه + ${Number(tab.specialPrice).toLocaleString(
                        "fa-IR"
                      )} تومان`
                    : "با قارچ و پنیر + 50 هزار تومان"}
                </span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tab.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center justify-between rounded-2xl bg-orange-950/20 p-4 gap-4 shadow-none"
              >
                {/* Image */}
                <LoadingImage
                  src={resolveMenuImageSrc(item["تصویر"])}
                  alt={getField(item, ["عنوان"]) || ""}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-[#232323] object-cover w-[80px] h-[80px]"
                />
                {/* Text content */}
                <div className="flex flex-col flex-1 gap-1 items-start text-start">
                  <span className="text-base font-bold text-white mb-1">
                    {getField(item, ["عنوان"])}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getField(item, ["رسپی"])}
                  </span>
                  <div className="flex justify-start w-full">
                    <span className="text-orange-400 font-bold text-lg mb-1">
                      {(() => {
                        const raw = getField(item, ["قیمت", "قیمت (تومان)"]);
                        const num = Number(raw.replace(/[^\d.]/g, ""));
                        return isNaN(num)
                          ? raw
                          : `${num.toLocaleString("fa-IR")} تومان`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
