import { LucidePhone } from "lucide-react";
import TabsExample from "./tabs";
import Link from "next/link";

export default function Home() {
  return (
    <div dir="rtl" className="font-sans bg-background">
      <nav className="bg-neutral-900 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-orange-400 text-lg font-bold">فست فود سالیوان</h1>
          <a href="tel:+989122995956">
            <button className="text-orange-500 p-2 rounded-full cursor-pointer">
              <LucidePhone width={20} height={20} />
            </button>
          </a>
        </div>
      </nav>
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
    </div>
  );
}
