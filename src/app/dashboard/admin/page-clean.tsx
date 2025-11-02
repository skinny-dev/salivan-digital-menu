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
  X,
  Check,
  Clock,
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

  const router = useRouter();

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenu = useCallback(async () => {
    try {
      setMenuLoading(true);
      const response = await fetch("/api/admin/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !selectedCategory) {
          setSelectedCategory(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setMenuLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/dashboard/login");
      return;
    }

    fetchOrders();
    fetchMenu();
  }, [router, fetchOrders, fetchMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/dashboard/login");
  };

  const handleOrderSubmit = () => {
    fetchOrders();
  };

  const filteredOrders = orders.filter((order) => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);

    if (dateFilter === "today") {
      return orderDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return orderDate.toDateString() === yesterday.toDateString();
    }

    return true;
  });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400"></div>
          <p className="mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800">
          <div className="p-6">
            <h1 className="text-xl font-bold mb-8">پنل مدیریت</h1>

            {/* Tab Navigation */}
            <nav className="space-y-2 mb-8">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === "orders"
                    ? "bg-green-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <ShoppingCart size={20} />
                سفارشات
              </button>

              <button
                onClick={() => setActiveTab("menu")}
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${
                  activeTab === "menu"
                    ? "bg-green-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <Menu size={20} />
                مدیریت منو
              </button>
            </nav>

            <div className="space-y-2">
              <Link
                href="/dashboard/admin"
                className="flex items-center gap-3 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Settings size={20} />
                تنظیمات
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-right flex items-center gap-3 p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <LogOut size={20} />
                خروج
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === "orders" ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">دخل - کافه کاج</h2>
                <div className="flex items-center gap-4">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                  >
                    <option value="today">امروز</option>
                    <option value="yesterday">دیروز</option>
                    <option value="all">همه</option>
                  </select>
                  <Calendar size={20} className="text-zinc-400" />
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-zinc-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-800">
                      <tr>
                        <th className="text-right p-4">تاریخ ثبت</th>
                        <th className="text-right p-4">شماره تماس</th>
                        <th className="text-right p-4">وضعیت</th>
                        <th className="text-right p-4">آدرس/میز</th>
                        <th className="text-right p-4">قیمت کل</th>
                        <th className="text-right p-4">آیتم‌ها</th>
                        <th className="text-right p-4">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-zinc-800">
                          <td className="p-4">
                            {new Date(order.createdAt).toLocaleDateString(
                              "fa-IR"
                            )}
                            <div className="text-xs text-zinc-400">
                              {new Date(order.createdAt).toLocaleTimeString(
                                "fa-IR"
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Phone size={16} className="text-zinc-400" />
                              {order.phone}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusColors[
                                  order.status as keyof typeof statusColors
                                ]
                              }`}
                            >
                              {
                                statusNames[
                                  order.status as keyof typeof statusNames
                                ]
                              }
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {order.orderType === "DELIVERY" ? (
                                <>
                                  <MapPin size={16} className="text-zinc-400" />
                                  <span className="text-sm">
                                    {order.address}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Package
                                    size={16}
                                    className="text-zinc-400"
                                  />
                                  <span className="text-sm">
                                    میز {order.table?.number}
                                  </span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <DollarSign
                                size={16}
                                className="text-green-400"
                              />
                              <span className="font-medium">
                                {order.totalAmount.toLocaleString()} تومان
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-zinc-400">
                              {order.items.map((item, index) => (
                                <div key={index}>
                                  {item.quantity}× {item.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-sm text-zinc-400">
                                #{order.orderNumber}
                              </span>
                              <span className="text-sm">{order.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Menu Management */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">مدیریت منو</h2>
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
                      className={`flex-shrink-0 p-2 rounded-lg border cursor-pointer transition-colors group w-[140px] h-[60px] ${
                        selectedCategory === category.id
                          ? "border-green-500 bg-green-500/10"
                          : "border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      {editingCategory === category.id ? (
                        <div
                          className="h-full flex flex-col justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="space-y-1">
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
                          </div>
                          <div className="flex gap-1 mt-1">
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
                          <Plus size={20} />
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
                                    onClick={() =>
                                      handleDeleteMenuItem(item.id)
                                    }
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
            </>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  نام دسته‌بندی
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  placeholder="مثال: پیش غذا"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ایموجی</label>
                <input
                  type="text"
                  value={categoryForm.emoji}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      emoji: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  placeholder="🍕"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    از ساعت
                  </label>
                  <input
                    type="time"
                    value={categoryForm.availableFrom}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        availableFrom: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    تا ساعت
                  </label>
                  <input
                    type="time"
                    value={categoryForm.availableTo}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        availableTo: e.target.value,
                      }))
                    }
                    className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-green-600 hover:bg-green-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                افزودن دسته‌بندی
              </button>
              <button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                  نام آیتم
                </label>
                <input
                  type="text"
                  value={menuItemForm.name}
                  onChange={(e) =>
                    setMenuItemForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  placeholder="مثال: پیتزا مارگاریتا"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  توضیحات
                </label>
                <textarea
                  value={menuItemForm.description}
                  onChange={(e) =>
                    setMenuItemForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none h-24 resize-none"
                  placeholder="توضیحات آیتم..."
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
                    setMenuItemForm((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
                  placeholder="150000"
                />
              </div>

              <ImageUpload
                value={menuItemForm.image}
                onChange={(filename) =>
                  setMenuItemForm((prev) => ({ ...prev, image: filename }))
                }
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddMenuItem}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                افزودن آیتم
              </button>
              <button
                onClick={() => setShowAddMenuItem(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                لغو
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
