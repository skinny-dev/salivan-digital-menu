"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Printer,
  Phone,
  MapPin,
  Package,
  Calendar,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  phone: string;
  orderType: string;
  address?: string;
  notes?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

const statusNames = {
  PENDING: "در انتظار",
  CONFIRMED: "تایید شده",
  PREPARING: "در حال آماده‌سازی",
  READY: "آماده",
  DELIVERED: "تحویل داده شد",
  CANCELLED: "لغو شده",
};

export default function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

   
  const fetchOrder = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else if (response.status === 401) {
        router.push("/dashboard/login");
      } else {
        router.push("/dashboard/admin");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    params.then(({ id }) => {
      setOrderId(id);
      fetchOrder(id);
    });
  }, [params, fetchOrder]);
  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React functionality
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">سفارش یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* Header */}
      <div className="bg-zinc-900 p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-300 hover:text-white"
            >
              <ArrowRight size={20} />
              <span>بازگشت</span>
            </button>
            <h1 className="text-xl font-bold">
              جزئیات سفارش #{order.orderNumber.slice(-6)}
            </h1>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
          >
            <Printer size={20} />
            <span>چاپ رسید</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">اطلاعات مشتری</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-zinc-400" />
                  <span>{order.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  {order.orderType === "DELIVERY" ? (
                    <>
                      <MapPin size={20} className="text-zinc-400" />
                      <span>{order.address}</span>
                    </>
                  ) : (
                    <>
                      <Package size={20} className="text-zinc-400" />
                      <span>تحویل حضوری</span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-zinc-400" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")} -
                    {new Date(order.createdAt).toLocaleTimeString("fa-IR")}
                  </span>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                  <h3 className="text-sm font-medium mb-2">توضیحات:</h3>
                  <p className="text-zinc-300 text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">آیتم‌های سفارش</h2>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img
                          src={`/images/${item.image}`}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-zinc-400 text-sm">
                          {item.price.toLocaleString()} تومان × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-400 font-medium">
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-700 mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>مجموع کل:</span>
                  <span className="text-green-400">
                    {order.totalAmount.toLocaleString()} تومان
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Actions */}
          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">وضعیت سفارش</h2>

              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(e.target.value)}
                className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg mb-4"
              >
                <option value="PENDING">در انتظار</option>
                <option value="CONFIRMED">تایید شده</option>
                <option value="PREPARING">در حال آماده‌سازی</option>
                <option value="READY">آماده</option>
                <option value="DELIVERED">تحویل داده شد</option>
                <option value="CANCELLED">لغو شده</option>
              </select>

              <div className="text-sm text-zinc-400">
                وضعیت فعلی:{" "}
                <span className="text-white">
                  {statusNames[order.status as keyof typeof statusNames]}
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">عملیات</h2>
              <div className="space-y-3">
                <button
                  onClick={handlePrint}
                  className="w-full bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Printer size={20} />
                  <span>چاپ رسید</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Receipt (Hidden) */}
      <div ref={printRef} className="hidden print:block print:text-black">
        <div className="max-w-sm mx-auto p-4 font-mono text-sm" dir="rtl">
          <div className="text-center mb-4">
            <h1 className="text-lg font-bold">فست فود سالیوان</h1>
            <p className="text-xs">تلفن: +989122995956</p>
            <p className="text-xs">تهران، چهاردانگه، اول خیابان شهید هیدخ</p>
            <p className="text-xs">بالای داروخانه دکتر اشرفی، پ 216</p>
            <div className="border-b border-gray-400 my-2"></div>
          </div>

          <div className="mb-4">
            <p>
              <strong>شماره سفارش:</strong> #{order.orderNumber.slice(-6)}
            </p>
            <p>
              <strong>تاریخ:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString("fa-IR")}
            </p>
            <p>
              <strong>ساعت:</strong>{" "}
              {new Date(order.createdAt).toLocaleTimeString("fa-IR")}
            </p>
            <p>
              <strong>شماره تماس:</strong> {order.phone}
            </p>
            <p>
              <strong>نوع سفارش:</strong>{" "}
              {order.orderType === "DELIVERY" ? "ارسال" : "تحویل حضوری"}
            </p>
            {order.address && (
              <p>
                <strong>آدرس:</strong> {order.address}
              </p>
            )}
            <div className="border-b border-gray-400 my-2"></div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">آیتم‌های سفارش:</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between mb-1">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-b border-gray-400 my-2"></div>
          </div>

          <div className="text-center mb-4">
            <p className="text-lg font-bold">
              مجموع: {order.totalAmount.toLocaleString()} تومان
            </p>
          </div>

          {order.notes && (
            <div className="mb-4">
              <p className="text-xs">
                <strong>توضیحات:</strong> {order.notes}
              </p>
              <div className="border-b border-gray-400 my-2"></div>
            </div>
          )}

          <div className="text-center text-xs">
            <p>با تشکر از حضور شما</p>
            <p>فست فود سالیوان</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block,
          .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .hidden {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
