"use client";
import { LucidePhone, MapPin, X } from "lucide-react";
import TabsExample from "./tabs";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [callOpen, setCallOpen] = useState(false);
  const mapsUrl =
    "https://maps.google.com/maps?q=35.608100,51.308674&ll=35.608100,51.308674&z=16";
  const phoneNumbers = [
    { label: "09122568011", href: "tel:+989122568011" },
    { label: "09122995956", href: "tel:+989122995956" },
    { label: "02155265100", href: "tel:+982155265100" },
  ];
  return (
    <div dir="rtl" className="font-sans bg-background">
      <nav className="bg-neutral-900 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-orange-400 text-lg font-bold">فست فود سالیوان</h1>
          <div className="flex items-center gap-2">
            <Link
              href={mapsUrl}
              target="_blank"
              className="rounded-full border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-700 text-orange-300 p-2"
            >
              <MapPin width={20} height={20} />
            </Link>
            <button
              onClick={() => setCallOpen(true)}
              className="text-white bg-orange-600 hover:bg-orange-500 p-2 rounded-full"
            >
              <LucidePhone width={20} height={20} />
            </button>
          </div>
        </div>
      </nav>
      {/* Address banner */}
      <div className="bg-neutral-800/60 border-y border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-200">
            <MapPin className="text-orange-400" width={18} height={18} />
            <span>چهاردانگه  خ هیدخ نبش گلستان دوم  غربی پ 210</span>
          </div>
          <Link
            href={mapsUrl}
            target="_blank"
            className="text-orange-400 text-sm hover:underline"
          >
            مشاهده نقشه
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center w-full max-w-6xl">
          <div className="flex-1 min-w-0">
            <TabsExample />
          </div>
        </div>
        <div
          className="flex w-full bg-neutral-900 items-center justify-center text-sm p-4 mt-2 gap-2"
          dir="rtl"
        >
          <span>طراحی شده توسط</span>
          <Link
            className="text-orange-400 font-bold"
            href="https://wa.me/989197916676"
          >
            علیرضا خدابخش
          </Link>
        </div>
      </div>

      {/* Call modal / bottom sheet */}
      {callOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
          onClick={() => setCallOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full md:w-[480px] bg-neutral-900 md:rounded-2xl rounded-t-2xl border border-neutral-800 p-4 mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">تماس با سالیوان</h3>
              <button
                className="text-neutral-400 hover:text-white"
                onClick={() => setCallOpen(false)}
              >
                <X width={20} height={20} />
              </button>
            </div>
            <div className="space-y-2">
              {phoneNumbers.map((p) => (
                <div
                  key={p.label}
                  className="flex items-center justify-between bg-neutral-800 rounded-xl px-3 py-3"
                >
                  <div className="text-neutral-100 font-mono">{p.label}</div>
                  <a
                    href={p.href}
                    className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-sm"
                  >
                    تماس
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
