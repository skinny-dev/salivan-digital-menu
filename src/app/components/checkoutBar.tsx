"use client";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QuantitySelector from "./quantitySelector";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";

interface CheckoutBarProps {
  isCheckoutPage?: boolean;
}

export default function CheckoutBar({
  isCheckoutPage = false,
}: CheckoutBarProps) {
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

  // Show loading skeleton
  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="fixed bottom-0 left-0 w-full flex justify-between p-4 bg-zinc-900 border-t-[1px] border-white/10 z-50 md:hidden"
        style={{ maxWidth: "100vw" }}
      >
        <div className="flex flex-col">
          {/* "x آیتم در سبد خرید" - text-sm */}
          <Skeleton className="h-4 w-32 mb-1" />
          <div className="flex items-center gap-2">
            {/* "مبلغ کل:" - font-medium */}
            <Skeleton className="h-5 w-16" />
            {/* Price - text-lg font-bold */}
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <div>
          {/* Button skeleton - exact same size px-6 py-2 */}
          <Skeleton className="w-20 h-10 rounded-lg" />
        </div>
      </div>
    );
  }

  // Don't show the bar if cart is empty
  if (totalItems === 0) {
    return null;
  }

  const handleOrder = () => {
    if (isCheckoutPage) {
      // TODO: Process payment
      console.log("Processing payment...");
    } else {
      router.push("/checkout");
    }
  };

  return (
    <>
      {/* Mobile: fixed bottom bar */}
      <div
        dir="rtl"
        className="fixed bottom-0 left-0 w-full flex justify-between p-4 bg-zinc-900 border-t-[1px] border-white/10 z-50 md:hidden"
        style={{ maxWidth: "100vw" }}
      >
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">
            {totalItems} آیتم در سبد خرید
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">مبلغ کل:</span>
            <span className="text-orange-400 font-bold text-lg">
              {totalPrice.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </div>
        <div>
          <button
            onClick={handleOrder}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {isCheckoutPage ? "پرداخت" : "سفارش"}
          </button>
        </div>
      </div>
    </>
  );
}
