"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderPanel from "../../components/orderPanel";
import ImageUpload from "../../components/imageUpload";
import {
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
  Calendar,
  Phone,
  MapPin,
  Package,
  Menu,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Eye,
  EyeOff,
  ChevronLeft,
  ArrowLeft,
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
  table?: {
    id: string;
    number: number;
  };
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  emoji?: string;
  order: number;
  isActive: boolean;
  availableFrom?: string;
  availableTo?: string;
  menuItems: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  order: number;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoryForm {
  name: string;
  emoji: string;
  availableFrom: string;
  availableTo: string;
}

interface MenuItemForm {
  name: string;
  description: string;
  price: string;
  image: string;
}

interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TableForm {
  number: number;
  name: string;
  capacity: number;
  isActive: boolean;
}

const statusColors = {
  PENDING: "bg-yellow-900 text-yellow-300",
  CONFIRMED: "bg-blue-900 text-blue-300",
  PREPARING: "bg-orange-900 text-orange-300",
  READY: "bg-green-900 text-green-300",
  DELIVERED: "bg-gray-900 text-gray-300",
  CANCELLED: "bg-red-900 text-red-300",
};

const statusNames = {
  PENDING: "در انتظار",
  CONFIRMED: "تایید شده",
  PREPARING: "در حال آماده‌سازی",
  READY: "آماده",
  DELIVERED: "تحویل داده شد",
  CANCELLED: "لغو شده",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today");
  const [activeTab, setActiveTab] = useState("orders");

  // Menu states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [menuLoading, setMenuLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: "",
    emoji: "",
    availableFrom: "09:00",
    availableTo: "23:00",
  });
  const [menuItemForm, setMenuItemForm] = useState<MenuItemForm>({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // Table states
  const [tables, setTables] = useState<Table[]>([]);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [tableForm, setTableForm] = useState<TableForm>({
    number: 1,
    name: "",
    capacity: 4,
    isActive: true,
  });

  const router = useRouter();

   
  const fetchOrders = useCallback(async () => {
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
  }, [router]);

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

  const deleteOrder = async (orderId: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این سفارش را حذف کنید؟")) {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchOrders(); // Refresh orders
        } else {
          alert("خطا در حذف سفارش");
        }
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("خطا در حذف سفارش");
      }
    }
  };

  const handleOrderSubmit = () => {
    fetchOrders(); // Refresh orders when a new order is submitted
  };

  const logout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/dashboard/login");
  };

  // Menu functions
  const fetchMenu = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].id);
        }
      } else if (response.status === 401) {
        router.push("/dashboard/login");
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setMenuLoading(false);
    }
  }, [router, selectedCategory]);

  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        await fetchMenu();
        setShowAddCategory(false);
        setCategoryForm({
          name: "",
          emoji: "",
          availableFrom: "09:00",
          availableTo: "23:00",
        });
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Menu management functions
  const handleEditCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        await fetchMenu();
        setEditingCategory(null);
        setCategoryForm({
          name: "",
          emoji: "",
          availableFrom: "09:00",
          availableTo: "23:00",
        });
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategory(category.id);
    setCategoryForm({
      name: category.name,
      emoji: category.emoji || "",
      availableFrom: category.availableFrom || "09:00",
      availableTo: category.availableTo || "23:00",
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟")) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchMenu();
        }
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleAddMenuItem = async () => {
    try {
      const response = await fetch("/api/admin/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...menuItemForm,
          price: parseInt(menuItemForm.price),
          categoryId: selectedCategory,
        }),
      });

      if (response.ok) {
        await fetchMenu();
        setShowAddMenuItem(false);
        setMenuItemForm({ name: "", description: "", price: "", image: "" });
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (confirm("آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟")) {
      try {
        const response = await fetch(`/api/admin/menu-items/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchMenu();
        }
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleEditMenuItem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu-items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...menuItemForm,
          price: parseInt(menuItemForm.price),
          categoryId: selectedCategory,
        }),
      });

      if (response.ok) {
        await fetchMenu();
        setEditingMenuItem(null);
        setMenuItemForm({ name: "", description: "", price: "", image: "" });
      }
    } catch (error) {
      console.error("Error editing menu item:", error);
    }
  };

  const startEditingMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item.id);
    setMenuItemForm({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      image: item.image || "",
    });
  };

  // Table management functions
  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/tables");
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      } else if (response.status === 401) {
        router.push("/dashboard/login");
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
    fetchTables();
  }, [fetchOrders, fetchMenu, fetchTables]);

  const handleAddTable = async () => {
    try {
      const response = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableForm),
      });

      if (response.ok) {
        setShowAddTable(false);
        setTableForm({
          number: Math.max(...tables.map((t) => t.number), 0) + 1,
          name: "",
          capacity: 4,
          isActive: true,
        });
        fetchTables();
      } else {
        const error = await response.json();
        alert(error.error || "خطا در افزودن میز");
      }
    } catch (error) {
      console.error("Error adding table:", error);
      alert("خطا در افزودن میز");
    }
  };

  const handleUpdateTable = async (tableId: string, data: Partial<Table>) => {
    try {
      const response = await fetch(`/api/admin/tables/${tableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditingTable(null);
        fetchTables();
      } else {
        const error = await response.json();
        alert(error.error || "خطا در ویرایش میز");
      }
    } catch (error) {
      console.error("Error updating table:", error);
      alert("خطا در ویرایش میز");
    }
  };

  const handleDeleteTable = async (tableId: string) => {
    if (!confirm("آیا از حذف این میز اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/admin/tables/${tableId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTables();
      } else {
        const error = await response.json();
        alert(error.error || "خطا در حذف میز");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("خطا در حذف میز");
    }
  };

  const startEditingTable = (table: Table) => {
    setEditingTable(table.id);
    setTableForm({
      number: table.number,
      name: table.name,
      capacity: table.capacity,
      isActive: table.isActive,
    });
  };

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    
    if (dateFilter === "today") {
      return (
        orderDate.getFullYear() === today.getFullYear() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getDate() === today.getDate()
      );
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return (
        orderDate.getFullYear() === yesterday.getFullYear() &&
        orderDate.getMonth() === yesterday.getMonth() &&
        orderDate.getDate() === yesterday.getDate()
      );
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return orderDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return orderDate >= monthAgo;
    }
    return true;
  });

  const todaySales = filteredOrders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 p-4 flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-orange-400 text-lg font-bold mb-2">
            فست فود سالیوان
          </h1>
          <p className="text-zinc-400 text-xs">پنل مدیریت</p>
        </div>

        <nav className="space-y-3 mb-6">
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm ${
              activeTab === "orders"
                ? "text-green-400 bg-green-400/10"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <ShoppingCart size={18} />
            <span>سفارشات</span>
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm ${
              activeTab === "menu"
                ? "text-green-400 bg-green-400/10"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Menu size={18} />
            <span>مدیریت منو</span>
          </button>
          <button
            onClick={() => setActiveTab("tables")}
            className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm ${
              activeTab === "tables"
                ? "text-green-400 bg-green-400/10"
                : "text-zinc-300 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Users size={18} />
            <span>مدیریت میزها</span>
          </button>
          <Link
            href="/dashboard/finance"
            className="w-full flex items-center gap-2 text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
          >
            <DollarSign size={18} />
            <span>مالی</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="w-full flex items-center gap-2 text-zinc-300 hover:text-white p-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm"
          >
            <Settings size={18} />
            <span>تنظیمات</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </nav>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="text-zinc-400 text-xs">
              فروش {dateFilter === "today" ? "امروز" : 
                    dateFilter === "yesterday" ? "دیروز" : 
                    dateFilter === "week" ? "هفته" : 
                    dateFilter === "month" ? "ماه" : "کل"}
            </div>
            <div className="text-green-400 text-lg font-bold">
              {todaySales.toLocaleString()} تومان
            </div>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="text-zinc-400 text-xs">
              سفارشات {dateFilter === "today" ? "امروز" : 
                       dateFilter === "yesterday" ? "دیروز" : 
                       dateFilter === "week" ? "هفته" : 
                       dateFilter === "month" ? "ماه" : "کل"}
            </div>
            <div className="text-blue-400 text-lg font-bold">
              {filteredOrders.length}
            </div>
          </div>
          <div className="bg-zinc-800 p-3 rounded-lg">
            <div className="text-zinc-400 text-xs">سفارشات در انتظار</div>
            <div className="text-yellow-400 text-lg font-bold">
              {filteredOrders.filter(order => order.status === "PENDING").length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "orders" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">مدیریت سفارشات</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  {filteredOrders.length} سفارش یافت شد
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                >
                  <option value="today">امروز</option>
                  <option value="yesterday">دیروز</option>
                  <option value="week">هفته گذشته</option>
                  <option value="month">ماه گذشته</option>
                  <option value="all">همه</option>
                </select>
                <Calendar size={20} className="text-zinc-400" />
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-zinc-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-zinc-800">
                    <tr>
                      <th className="text-right p-4 whitespace-nowrap">تاریخ ثبت</th>
                      <th className="text-right p-4 whitespace-nowrap">شماره تماس</th>
                      <th className="text-right p-4 whitespace-nowrap">وضعیت</th>
                      <th className="text-right p-4 whitespace-nowrap">آدرس/میز</th>
                      <th className="text-right p-4 whitespace-nowrap">قیمت کل</th>
                      <th className="text-right p-4 whitespace-nowrap">آیتم‌ها</th>
                      <th className="text-right p-4 whitespace-nowrap">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-400">
                          <div className="flex flex-col items-center gap-2">
                            <ShoppingCart size={48} className="text-zinc-600" />
                            <p>سفارشی در این بازه زمانی یافت نشد</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b border-zinc-800">
                        <td className="p-4">
                          <div className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString("fa-IR", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-zinc-400">
                            {new Date(order.createdAt).toLocaleTimeString("fa-IR", {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Phone size={16} className="text-zinc-400" />
                            {order.phone}
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className={`rounded-lg px-3 py-1 text-sm border-0 ${
                              statusColors[
                                order.status as keyof typeof statusColors
                              ]
                            }`}
                          >
                            <option value="PENDING">در انتظار</option>
                            <option value="CONFIRMED">تایید شده</option>
                            <option value="PREPARING">در حال آماده‌سازی</option>
                            <option value="READY">آماده</option>
                            <option value="DELIVERED">تحویل داده شد</option>
                            <option value="CANCELLED">لغو شده</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {order.orderType === "DELIVERY" ? (
                              <>
                                <MapPin size={16} className="text-zinc-400" />
                                <span className="text-sm">{order.address}</span>
                              </>
                            ) : order.orderType === "DINE_IN" && order.table ? (
                              <>
                                <Package size={16} className="text-zinc-400" />
                                <span className="text-sm">
                                  میز {order.table.number}
                                </span>
                              </>
                            ) : (
                              <>
                                <Package size={16} className="text-zinc-400" />
                                <span className="text-sm">تحویل حضوری</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-green-400">
                          {order.totalAmount.toLocaleString()} تومان
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                {item.quantity}× {item.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/dashboard/orders/${order.id}`}
                              className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 rounded transition-colors"
                            >
                              جزئیات
                            </Link>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              حذف
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : activeTab === "tables" ? (
          // Tables Management Tab
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">مدیریت میزها</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddTable(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  <span>میز جدید</span>
                </button>
              </div>
            </div>

            {/* Tables Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="text-zinc-400 text-sm">کل میزها</div>
                <div className="text-2xl font-bold text-white">
                  {tables.length}
                </div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="text-zinc-400 text-sm">میزهای فعال</div>
                <div className="text-2xl font-bold text-green-400">
                  {tables.filter((t) => t.isActive).length}
                </div>
              </div>
              <div className="bg-zinc-900 p-4 rounded-lg">
                <div className="text-zinc-400 text-sm">کل ظرفیت</div>
                <div className="text-2xl font-bold text-blue-400">
                  {tables.reduce(
                    (sum, t) => sum + (t.isActive ? t.capacity : 0),
                    0
                  )}{" "}
                  نفر
                </div>
              </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tables
                .sort((a, b) => a.number - b.number)
                .map((table) => (
                  <div
                    key={table.id}
                    className={`p-4 rounded-lg border-2 transition-all relative group h-[140px] ${
                      table.isActive
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 bg-zinc-800"
                    }`}
                  >
                    {editingTable === table.id ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={tableForm.number}
                          onChange={(e) =>
                            setTableForm((prev) => ({
                              ...prev,
                              number: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full p-1 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                          placeholder="شماره میز"
                          min="1"
                        />
                        <input
                          type="text"
                          value={tableForm.name}
                          onChange={(e) =>
                            setTableForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full p-1 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                          placeholder="نام میز"
                        />
                        <input
                          type="number"
                          value={tableForm.capacity}
                          onChange={(e) =>
                            setTableForm((prev) => ({
                              ...prev,
                              capacity: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-full p-1 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                          placeholder="ظرفیت"
                          min="1"
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              handleUpdateTable(table.id, tableForm)
                            }
                            className="flex-1 bg-green-600 hover:bg-green-700 p-1 rounded text-xs"
                          >
                            <Save size={12} className="mx-auto" />
                          </button>
                          <button
                            onClick={() => setEditingTable(null)}
                            className="flex-1 bg-zinc-600 hover:bg-zinc-700 p-1 rounded text-xs"
                          >
                            <X size={12} className="mx-auto" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="text-3xl font-bold mb-2">
                          {table.number}
                        </div>
                        <div className="text-sm text-zinc-400 mb-1">
                          {table.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-zinc-300">
                          <Users size={12} />
                          <span>{table.capacity} نفر</span>
                        </div>
                        {!table.isActive && (
                          <div className="absolute top-2 right-2">
                            <EyeOff size={16} className="text-red-400" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Table Action Buttons */}
                    {editingTable !== table.id && (
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={() => startEditingTable(table)}
                          className="bg-blue-600 hover:bg-blue-700 p-1 rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteTable(table.id)}
                          className="bg-red-600 hover:bg-red-700 p-1 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateTable(table.id, {
                              isActive: !table.isActive,
                            })
                          }
                          className={`p-1 rounded ${
                            table.isActive
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {table.isActive ? (
                            <EyeOff size={12} />
                          ) : (
                            <Eye size={12} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Add Table Modal */}
            {showAddTable && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">میز جدید</h3>
                    <button
                      onClick={() => setShowAddTable(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        شماره میز
                      </label>
                      <input
                        type="number"
                        value={tableForm.number}
                        onChange={(e) =>
                          setTableForm((prev) => ({
                            ...prev,
                            number: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="1"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ظرفیت (تعداد نفر)
                      </label>
                      <input
                        type="number"
                        value={tableForm.capacity}
                        onChange={(e) =>
                          setTableForm((prev) => ({
                            ...prev,
                            capacity: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="4"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نام میز
                      </label>
                      <input
                        type="text"
                        value={tableForm.name}
                        onChange={(e) =>
                          setTableForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="مثل: میز کنار پنجره"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tableForm.isActive}
                        onChange={(e) =>
                          setTableForm((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                        className="rounded"
                      />
                      <label className="text-sm">فعال</label>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowAddTable(false)}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        لغو
                      </button>
                      <button
                        onClick={handleAddTable}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        افزودن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Menu Management Tab
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">مدیریت منو</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  <span>دسته‌بندی جدید</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-lg font-medium">دسته‌بندی‌ها</h2>
                <span className="text-zinc-400 text-sm">
                  ({categories.length} دسته‌بندی)
                </span>
              </div>

              <div className="flex flex-wrap gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 p-2 rounded-lg border cursor-pointer transition-colors group w-[140px] h-[100px] ${
                      selectedCategory === category.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {editingCategory === category.id ? (
                      <div
                        className="space-y-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={categoryForm.emoji}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              emoji: e.target.value,
                            }))
                          }
                          placeholder="ایموجی"
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-xs"
                        />
                        <input
                          type="text"
                          value={categoryForm.name}
                          onChange={(e) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="نام دسته‌بندی"
                          className="w-full px-2 py-1 bg-zinc-800 border border-zinc-600 rounded text-xs"
                        />
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleEditCategory(category.id)}
                            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs flex-1"
                          >
                            ذخیره
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null);
                              setCategoryForm({
                                name: "",
                                emoji: "",
                                availableFrom: "09:00",
                                availableTo: "23:00",
                              });
                            }}
                            className="bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded text-xs flex-1"
                          >
                            لغو
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-between text-center">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingCategory(category);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category.id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center flex-1">
                          <span className="text-2xl mb-1">
                            {category.emoji}
                          </span>
                          <h3 className="font-medium text-sm truncate w-full">
                            {category.name}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1">
                            ({category.menuItems?.length || 0})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Category Items */}
            {selectedCategory && (
              <div>
                {(() => {
                  const currentCategory = categories.find(
                    (c) => c.id === selectedCategory
                  );
                  return (
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-medium">
                        آیتم‌های {currentCategory?.name}
                      </h2>
                      <button
                        onClick={() => setShowAddMenuItem(true)}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus size={16} />
                        <span>آیتم جدید</span>
                      </button>
                    </div>
                  );
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories
                    .find((c) => c.id === selectedCategory)
                    ?.menuItems?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-zinc-800 rounded-lg p-4 group"
                      >
                        {editingMenuItem === item.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={menuItemForm.name}
                              onChange={(e) =>
                                setMenuItemForm((prev) => ({
                                  ...prev,
                                  name: e.target.value,
                                }))
                              }
                              placeholder="نام آیتم"
                              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
                            />
                            <textarea
                              value={menuItemForm.description}
                              onChange={(e) =>
                                setMenuItemForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="توضیحات"
                              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded h-20 resize-none"
                            />
                            <input
                              type="number"
                              value={menuItemForm.price}
                              onChange={(e) =>
                                setMenuItemForm((prev) => ({
                                  ...prev,
                                  price: e.target.value,
                                }))
                              }
                              placeholder="قیمت"
                              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
                            />
                            <input
                              type="text"
                              value={menuItemForm.image}
                              onChange={(e) =>
                                setMenuItemForm((prev) => ({
                                  ...prev,
                                  image: e.target.value,
                                }))
                              }
                              placeholder="نام فایل تصویر"
                              className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditMenuItem(item.id)}
                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded flex-1"
                              >
                                ذخیره
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMenuItem(null);
                                  setMenuItemForm({
                                    name: "",
                                    description: "",
                                    price: "",
                                    image: "",
                                  });
                                }}
                                className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded flex-1"
                              >
                                لغو
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-zinc-400 mt-1">
                                  {item.description}
                                </p>
                                <p className="text-green-400 font-medium mt-2">
                                  {item.price?.toLocaleString()} تومان
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditingMenuItem(item)}
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenuItem(item.id)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                            {item.image && (
                              <div className="w-full h-32 bg-zinc-700 rounded overflow-hidden">
                                <img
                                  src={`/images/${item.image}`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Add Category Modal */}
            {showAddCategory && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">دسته‌بندی جدید</h3>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نام
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="نام دسته‌بندی"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ایموجی
                      </label>
                      <input
                        type="text"
                        value={categoryForm.emoji}
                        onChange={(e) =>
                          setCategoryForm({
                            ...categoryForm,
                            emoji: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="🍕"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowAddCategory(false)}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        لغو
                      </button>
                      <button
                        onClick={handleAddCategory}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        افزودن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Menu Item Modal */}
            {showAddMenuItem && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">آیتم جدید</h3>
                    <button
                      onClick={() => setShowAddMenuItem(false)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        نام
                      </label>
                      <input
                        type="text"
                        value={menuItemForm.name}
                        onChange={(e) =>
                          setMenuItemForm({
                            ...menuItemForm,
                            name: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="نام آیتم"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        توضیحات
                      </label>
                      <textarea
                        value={menuItemForm.description}
                        onChange={(e) =>
                          setMenuItemForm({
                            ...menuItemForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="توضیحات آیتم"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        قیمت (تومان)
                      </label>
                      <input
                        type="number"
                        value={menuItemForm.price}
                        onChange={(e) =>
                          setMenuItemForm({
                            ...menuItemForm,
                            price: e.target.value,
                          })
                        }
                        className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                        placeholder="0"
                      />
                    </div>
                    <ImageUpload
                      value={menuItemForm.image}
                      onChange={(filename) =>
                        setMenuItemForm({ ...menuItemForm, image: filename })
                      }
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowAddMenuItem(false)}
                        className="flex-1 bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg transition-colors"
                      >
                        لغو
                      </button>
                      <button
                        onClick={handleAddMenuItem}
                        className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        افزودن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Panel (Right Side) */}
      <OrderPanel onOrderSubmit={handleOrderSubmit} />
    </div>
  );
}
