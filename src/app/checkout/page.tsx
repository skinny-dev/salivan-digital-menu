"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { ChevronRight } from "lucide-react";
import CheckOutAside from "../components/checkoutAside";
import CheckoutBar from "../components/checkoutBar";
import QuantitySelector from "../components/quantitySelector";
import { Skeleton } from "../components/ui/skeleton";
import LoadingImage from "../components/loadingImage";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart, isLoading, setLoading } =
    useCartStore();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");

  const totalPrice = getTotalPrice();

  useEffect(() => {
    // Simulate loading cart from localStorage
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const handleSubmitOrder = async () => {
    // TODO: Submit order to API
    console.log("Order submitted:", {
      items,
      customerInfo,
      paymentMethod,
      orderType,
      total: totalPrice,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white" dir="rtl">
        {/* Header Skeleton - exact same as real header */}
        <div className="flex items-center p-4 lg:px-8 lg:py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5 rounded" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-start gap-6 p-4 lg:p-8 lg:pt-6 lg:pb-8">
          <div className="w-full lg:flex-1 lg:max-w-lg">
            <div className="space-y-6 lg:space-y-8">
              <div className="flex flex-col gap-3">
                {/* Phone input skeleton - exact same height */}
                <Skeleton className="h-12 w-full rounded-lg" />

                {/* Order type buttons skeleton - exact same layout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg border-2 border-white/10 bg-zinc-900">
                    <div className="flex justify-center items-center text-center">
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border-2 border-white/10 bg-zinc-900">
                    <div className="text-center">
                      <Skeleton className="h-5 w-20 mx-auto" />
                    </div>
                  </div>
                </div>

                {/* Address textarea skeleton - conditional height */}
                <Skeleton className="h-24 w-full rounded-lg" />

                {/* Notes textarea skeleton - exact same height */}
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>

              {/* Mobile Cart Items Skeleton - exact same layout */}
              <div className="lg:hidden mt-6">
                {/* Title skeleton - exact same as "آیتم‌های سبد خرید" */}
                <Skeleton className="h-7 w-40 mb-4" />

                <div className="flex flex-col gap-2 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg"
                    >
                      <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Name skeleton - exact same as h4 */}
                        <Skeleton className="h-4 w-3/4" />
                        {/* Price skeleton - exact same as p */}
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      {/* QuantitySelector skeleton - exact same size */}
                      <Skeleton className="w-24 h-8 rounded-lg flex-shrink-0" />
                    </div>
                  ))}
                </div>

                {/* Total section skeleton - exact same layout */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <CheckOutAside />
          </div>
        </div>

        {/* Mobile CheckoutBar */}
        <div className="lg:hidden">
          <CheckoutBar isCheckoutPage={true} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">سبد خرید شما خالی است</h2>
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            بازگشت به منو
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Header */}
      <div className="flex items-center p-4 lg:px-8 lg:py-6 border-b border-white/10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-green-400 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
          <span>بازگشت به منو</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-start gap-6 p-4 lg:p-8 lg:pt-6 lg:pb-8">
        <div className="w-full lg:flex-1 lg:max-w-lg">
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col gap-3">
              <input
                dir={customerInfo.phone.length > 0 ? "ltr" : "rtl"}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="شماره تماس"
                value={customerInfo.phone}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setCustomerInfo((prev) => ({ ...prev, phone: value }));
                }}
                className="w-full p-3 bg-zinc-900 rounded-lg border border-white/10 focus:border-green-400 outline-none text-right"
              />

              {/* Order Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrderType("delivery")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    orderType === "delivery"
                      ? "border-green-400 bg-green-400/10"
                      : "border-white/10 bg-zinc-900"
                  }`}
                >
                  <div className="flex justify-center items-center text-center">
                    <div className="font-medium">ارسال با پیک</div>
                  </div>
                </button>

                <button
                  onClick={() => setOrderType("pickup")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    orderType === "pickup"
                      ? "border-green-400 bg-green-400/10"
                      : "border-white/10 bg-zinc-900"
                  }`}
                >
                  <div className="text-center">
                    {/* <div className="text-2xl mb-2">🏪</div> */}
                    <div className="font-medium">تحویل حضوری</div>
                  </div>
                </button>
              </div>

              {/* Delivery Address (if delivery selected) */}
              {orderType === "delivery" && (
                <textarea
                  placeholder="آدرس کامل محل مورد نظر"
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-900 rounded-lg border border-white/10 focus:border-green-400 outline-none h-24 resize-none"
                />
              )}

              <textarea
                placeholder="توضیحات اضافی  (اختیاری)"
                value={customerInfo.notes}
                onChange={(e) =>
                  setCustomerInfo((prev) => ({
                    ...prev,
                    notes: e.target.value,
                  }))
                }
                className="w-full p-3 bg-zinc-900 rounded-lg border border-white/10 focus:border-green-400 outline-none h-20 resize-none"
              />
            </div>

            {/* Mobile Cart Items - Only show on mobile */}
            <div className="lg:hidden mt-6">
              <h3 className="text-lg font-medium mb-4">آیتم‌های سبد خرید</h3>
              <div className="flex flex-col gap-2 mb-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg"
                  >
                    <LoadingImage
                      src={`/images/${
                        item.image?.replace(/^\.\//, "") || "default.jpg"
                      }`}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-green-400 font-bold text-xs">
                        {item.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                    <QuantitySelector item={item} />
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">مبلغ کل:</span>
                  <span className="text-green-400 font-bold text-lg">
                    {totalPrice.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              </div>
            </div>

            {/* Add bottom padding to avoid fixed elements */}
            <div className="h-14 lg:h-0" />
          </div>
        </div>

        <div className="hidden lg:block">
          <CheckOutAside />
        </div>
      </div>

      {/* Mobile CheckoutBar */}
      <div className="lg:hidden">
        <CheckoutBar isCheckoutPage={true} />
      </div>
    </div>
  );
}
