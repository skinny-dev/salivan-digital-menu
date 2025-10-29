"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderPanel from "@/app/components/orderPanel";
import {
  ShoppingCart,
  LogOut,
  Phone,
  MapPin,
  Package,
  Clock,
  Users,
} from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  phone: string;
  orderType: string;
  address?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  table?: Table;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  isActive: boolean;
}

const statusColors = {
  PENDING: "bg-yellow-900 text-yellow-300 border-yellow-500",
  CONFIRMED: "bg-blue-900 text-blue-300 border-blue-500",
  PREPARING: "bg-orange-900 text-orange-300 border-orange-500",
  READY: "bg-orange-900 text-orange-300 border-orange-500",
  DELIVERED: "bg-gray-900 text-gray-300 border-gray-500",
  CANCELLED: "bg-red-900 text-red-300 border-red-500",
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrders();
    // Auto-refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else if (response.status === 401) {
        router.push("/dashboard/login");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleOrderSubmit = async (orderData: any) => {
    setIsSubmittingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        fetchOrders(); // Refresh orders list
      } else {
        console.error("Failed to submit order");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/dashboard/login");
  };

  const todayOrders = orders.filter(
    (order) =>
      new Date(order.createdAt).toDateString() === new Date().toDateString()
  );

  const activeOrders = todayOrders.filter(
    (order) => !["DELIVERED", "CANCELLED"].includes(order.status)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex" dir="rtl">
      {/* Main Content - Orders */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-zinc-900 p-4 border-b border-zinc-800 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-orange-400 text-xl font-bold">
                فست فود سالیوان
              </h1>
              <p className="text-zinc-400 text-sm">پنل کارکنان</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-zinc-400">سفارشات فعال: </span>
                <span className="text-orange-400 font-bold">
                  {activeOrders.length}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={20} />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="text-zinc-400 text-sm">سفارشات امروز</div>
            <div className="text-white text-2xl font-bold">
              {todayOrders.length}
            </div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="text-zinc-400 text-sm">در حال آماده‌سازی</div>
            <div className="text-orange-400 text-2xl font-bold">
              {activeOrders.filter((o) => o.status === "PREPARING").length}
            </div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="text-zinc-400 text-sm">آماده</div>
            <div className="text-orange-400 text-2xl font-bold">
              {activeOrders.filter((o) => o.status === "READY").length}
            </div>
          </div>
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="text-zinc-400 text-sm">تحویل داده شده</div>
            <div className="text-gray-400 text-2xl font-bold">
              {todayOrders.filter((o) => o.status === "DELIVERED").length}
            </div>
          </div>
        </div>

        {/* Active Orders - Card View */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">سفارشات فعال</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-zinc-900 rounded-lg p-4 border-2 ${
                  statusColors[order.status as keyof typeof statusColors]
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} />
                    <span className="font-medium">
                      سفارش #{order.orderNumber.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Clock size={12} />
                    {new Date(order.createdAt).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-zinc-400" />
                    <span>{order.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    {order.orderType === "DELIVERY" ? (
                      <>
                        <MapPin size={14} className="text-zinc-400" />
                        <span className="text-xs text-zinc-300">
                          {order.address}
                        </span>
                      </>
                    ) : order.orderType === "PICKUP" ? (
                      <>
                        <Package size={14} className="text-zinc-400" />
                        <span>تحویل حضوری</span>
                      </>
                    ) : (
                      <>
                        <Users size={14} className="text-zinc-400" />
                        <span>{order.table?.name}</span>
                      </>
                    )}
                  </div>

                  <div className="text-orange-400 font-medium text-sm">
                    {order.totalAmount.toLocaleString()} تومان
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-zinc-800 rounded p-3 mb-4">
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-zinc-400">
                          {item.price.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                    className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-sm"
                  >
                    <option value="PENDING">در انتظار</option>
                    <option value="CONFIRMED">تایید شده</option>
                    <option value="PREPARING">در حال آماده‌سازی</option>
                    <option value="READY">آماده</option>
                    <option value="DELIVERED">تحویل داده شد</option>
                  </select>

                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded transition-colors"
                  >
                    جزئیات و چاپ
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {activeOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-zinc-400 text-lg">
                هیچ سفارش فعالی وجود ندارد
              </div>
              <div className="text-zinc-500 text-sm mt-2">
                سفارشات جدید به صورت خودکار نمایش داده می‌شوند
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Panel Component */}
      <OrderPanel
        onOrderSubmit={handleOrderSubmit}
        isSubmitting={isSubmittingOrder}
      />
    </div>
  );
}
