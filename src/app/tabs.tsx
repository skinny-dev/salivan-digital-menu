"use client";
import { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Papa from "papaparse";
import Image from "next/image";
import { Skeleton } from "./components/ui/skeleton";
import LoadingImage from "./components/loadingImage";

// Define a type for spreadsheet rows
type MenuItem = Record<string, string>;

// Group by icon+name
function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  const groups: Record<string, MenuItem[]> = {};
  items.forEach((item) => {
    // Use both trimmed icon and name as key, trimming whitespace
    const icon = (item["آیکون دست بندی"] || "").trim();
    const name = (item["نام دسته بندی"] || "").trim();
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
    { icon: string; name: string; value: string; items: MenuItem[] }[]
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
          return {
            icon,
            name,
            value: `tab${idx}`,
            items,
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
            <div key={i} className="flex flex-row items-center justify-between rounded-2xl bg-zinc-900 p-4 gap-4 shadow-none">
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
          <div className="text-[white] text-xl font-bold p-5 flex items-center gap-2">
            <span>{tab.name}</span>
            <span className="text-2xl">{tab.icon}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tab.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center justify-between rounded-2xl bg-zinc-900 p-4 gap-4 shadow-none"
              >
                {/* Image */}
                <LoadingImage
                  src={`/images/${item["تصویر"].replace(/^\.\//, "")}`}
                  alt={item["عنوان"]}
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-[#232323] object-cover w-[80px] h-[80px]"
                />
                {/* Text content */}
                <div className="flex flex-col flex-1 gap-1 items-start text-start">
                  <span className="text-base font-bold text-white mb-1">
                    {item["عنوان"]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item["رسپی"]}
                  </span>
                  <div className="flex justify-start w-full">
                    <span className="text-orange-400 font-bold text-lg mb-1">
                      {Number(item["قیمت"]).toLocaleString("fa-IR")} تومان
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
