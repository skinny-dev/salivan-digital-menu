"use client";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";
import QuantitySelector from "./quantitySelector";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import LoadingImage from "./loadingImage";

export default function CheckOutAside() {
  const router = useRouter();

  const { getTotalPrice, getTotalItems, items, isLoading, setLoading } =
    useCartStore();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  useEffect(() => {
    // Simulate loading cart from localStorage
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const handleOrder = () => {
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <aside className="bg-background border p-4 mt-4 rounded-2xl w-80 max-w-sm flex flex-col">
        <div className="flex flex-col gap-2 flex-1">
          <div className="space-y-2 overflow-auto max-h-96">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg"
              >
                <Skeleton className="w-[40px] h-[40px] rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Name skeleton - text-sm font-medium */}
                  <Skeleton className="h-4 w-3/4" />
                  {/* Price skeleton - text-xs font-bold */}
                  <Skeleton className="h-3 w-1/2" />
                </div>
                {/* QuantitySelector skeleton - exact same size */}
                <Skeleton className="w-24 h-8 rounded-lg flex-shrink-0" />
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-4 mt-auto">
            <div className="flex flex-col gap-2 mb-4">
              {/* "x آیتم در سبد خرید" - text-sm */}
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center justify-between">
                {/* "مبلغ کل:" - font-medium */}
                <Skeleton className="h-5 w-16" />
                {/* Price - text-lg font-bold */}
                <Skeleton className="h-6 w-28" />
              </div>
            </div>
            {/* Button skeleton - exact same size */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </aside>
    );
  }
  return (
    <aside className="bg-background border p-4 mt-4 rounded-2xl w-80 max-w-sm flex flex-col">
      {items.length !== 0 ? (
        <>
          {/* <h2 className="mb-3 font-medium">سبد سفارش</h2> */}
          <div className="flex flex-col gap-2 flex-1">
            <div
              className="space-y-2 overflow-auto max-h-96"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#eeeeee #18181b",
              }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg"
                >
                  <LoadingImage
                    src={item.image ?? ""}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-[40px] h-[40px]"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-white truncate">
                      {item.name}
                    </h3>
                    <p className="text-green-400 font-bold text-xs">
                      {item.price.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                  <QuantitySelector item={item} />
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 mt-auto">
              <div className="flex flex-col gap-2 mb-4">
                <span className="text-sm text-gray-400">
                  {totalItems} آیتم در سبد خرید
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">مبلغ کل:</span>
                  <span className="text-green-400 font-bold text-lg">
                    {totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
              <button
                onClick={handleOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
              >
                پرداخت
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <span className="text-gray-400">سبد سفارش خالی میباشد</span>
        </div>
      )}
    </aside>
  );
}
