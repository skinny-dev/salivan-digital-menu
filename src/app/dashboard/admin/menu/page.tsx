"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "../../../components/imageUpload";
import {
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
  Package,
  Users,
} from "lucide-react";

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
  order: number;
  isActive: boolean;
  availableFrom: string;
  availableTo: string;
}

interface MenuItemForm {
  name: string;
  description: string;
  price: number;
  image: string;
  order: number;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string;
}

export default function MenuManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: "",
    emoji: "",
    order: 0,
    isActive: true,
    availableFrom: "00:00",
    availableTo: "23:59",
  });
  const [menuItemForm, setMenuItemForm] = useState<MenuItemForm>({
    name: "",
    description: "",
    price: 0,
    image: "",
    order: 0,
    isActive: true,
    isAvailable: true,
    categoryId: "",
  });
  const router = useRouter();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
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
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        setShowAddCategory(false);
        setCategoryForm({
          name: "",
          emoji: "",
          order: 0,
          isActive: true,
          availableFrom: "00:00",
          availableTo: "23:59",
        });
        fetchMenu();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    data: Partial<Category>
  ) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditingCategory(null);
        fetchMenu();
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMenu();
        if (selectedCategory === categoryId) {
          setSelectedCategory(categories[0]?.id || "");
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddMenuItem = async () => {
    try {
      const response = await fetch("/api/admin/menu-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...menuItemForm, categoryId: selectedCategory }),
      });

      if (response.ok) {
        setShowAddMenuItem(false);
        setMenuItemForm({
          name: "",
          description: "",
          price: 0,
          image: "",
          order: 0,
          isActive: true,
          isAvailable: true,
          categoryId: "",
        });
        fetchMenu();
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  };

  const handleUpdateMenuItem = async (
    itemId: string,
    data: Partial<MenuItem>
  ) => {
    try {
      const response = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEditingMenuItem(null);
        fetchMenu();
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("آیا از حذف این آیتم اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMenu();
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const menuItems = currentCategory?.menuItems || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>بازگشت به داشبرد</span>
          </Link>
          <h1 className="text-2xl font-bold">مدیریت منو</h1>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/admin/tables"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Users size={20} />
            <span>مدیریت میزها</span>
          </Link>
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer relative group h-[120px] ${
                selectedCategory === category.id
                  ? "border-green-400 bg-green-400/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
              onClick={() => {
                if (editingCategory !== category.id) {
                  setSelectedCategory(category.id);
                }
              }}
            >
              {editingCategory === category.id ? (
                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) =>
                      handleUpdateCategory(category.id, {
                        name: e.target.value,
                      })
                    }
                    className="w-full p-1 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                  />
                  <input
                    type="text"
                    value={category.emoji || ""}
                    onChange={(e) =>
                      handleUpdateCategory(category.id, {
                        emoji: e.target.value,
                      })
                    }
                    className="w-full p-1 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none text-center"
                    placeholder="ایموجی"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="flex-1 bg-green-600 hover:bg-green-700 p-1 rounded text-xs"
                    >
                      <Save size={12} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="flex-1 bg-zinc-600 hover:bg-zinc-700 p-1 rounded text-xs"
                    >
                      <X size={12} className="mx-auto" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-2xl">{category.emoji}</div>
                  <div className="text-sm font-medium mt-2 truncate w-full px-1">
                    {category.name}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    {category.menuItems?.length || 0} آیتم
                  </div>
                  {!category.isActive && (
                    <div className="absolute top-2 right-2">
                      <EyeOff size={16} className="text-red-400" />
                    </div>
                  )}
                </div>
              )}

              {/* Category Action Buttons */}
              {editingCategory !== category.id && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingCategory(category.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 p-1 rounded"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="bg-red-600 hover:bg-red-700 p-1 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateCategory(category.id, {
                        isActive: !category.isActive,
                      });
                    }}
                    className={`p-1 rounded ${
                      category.isActive
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {category.isActive ? (
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
      </div>

      {/* Menu Items */}
      {selectedCategory && (
        <div className="bg-zinc-900 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium">
                آیتم‌های {currentCategory?.name}
              </h2>
              <span className="text-zinc-400 text-sm">
                ({menuItems.length} آیتم)
              </span>
            </div>
            <button
              onClick={() => setShowAddMenuItem(true)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>آیتم جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-800 rounded-lg p-4 relative group"
              >
                {editingMenuItem === item.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleUpdateMenuItem(item.id, { name: e.target.value })
                      }
                      className="w-full p-2 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                      placeholder="نام آیتم"
                    />
                    <textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        handleUpdateMenuItem(item.id, {
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none h-16 resize-none"
                      placeholder="توضیحات"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateMenuItem(item.id, {
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 text-sm bg-zinc-700 rounded border border-zinc-600 focus:border-green-400 outline-none"
                      placeholder="قیمت"
                    />
                    <ImageUpload
                      value={item.image || ""}
                      onChange={(filename) =>
                        handleUpdateMenuItem(item.id, { image: filename })
                      }
                      placeholder="نام فایل تصویر"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingMenuItem(null)}
                        className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded text-sm"
                      >
                        ذخیره
                      </button>
                      <button
                        onClick={() => setEditingMenuItem(null)}
                        className="flex-1 bg-zinc-600 hover:bg-zinc-700 p-2 rounded text-sm"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {item.image && (
                      <div className="w-full h-32 bg-zinc-700 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={`/images/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <div className="flex gap-1">
                          {!item.isActive && (
                            <EyeOff size={16} className="text-red-400" />
                          )}
                          {!item.isAvailable && (
                            <X size={16} className="text-orange-400" />
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <p className="text-sm text-zinc-400">
                          {item.description}
                        </p>
                      )}

                      <div className="text-green-400 font-medium">
                        {item.price.toLocaleString()} تومان
                      </div>
                    </div>

                    {/* Menu Item Action Buttons */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => setEditingMenuItem(item.id)}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateMenuItem(item.id, {
                            isActive: !item.isActive,
                          })
                        }
                        className={`p-2 rounded ${
                          item.isActive
                            ? "bg-orange-600 hover:bg-orange-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {item.isActive ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateMenuItem(item.id, {
                            isAvailable: !item.isAvailable,
                          })
                        }
                        className={`p-2 rounded ${
                          item.isAvailable
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {item.isAvailable ? (
                          <X size={14} />
                        ) : (
                          <Package size={14} />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
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
                  placeholder="مثل: پیش غذا"
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
                  placeholder="🍟"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
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
                <div>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="rounded"
                />
                <label className="text-sm">فعال</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddCategory}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
              >
                افزودن
              </button>
              <button
                onClick={() => setShowAddCategory(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded-lg transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddMenuItem && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
                  placeholder="مثل: پیتزا مارگاریتا"
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
                  className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none h-20 resize-none"
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
                      price: parseInt(e.target.value) || 0,
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
                placeholder="نام فایل تصویر"
              />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={menuItemForm.isActive}
                    onChange={(e) =>
                      setMenuItemForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <label className="text-sm">فعال</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={menuItemForm.isAvailable}
                    onChange={(e) =>
                      setMenuItemForm((prev) => ({
                        ...prev,
                        isAvailable: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <label className="text-sm">موجود</label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddMenuItem}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
              >
                افزودن
              </button>
              <button
                onClick={() => setShowAddMenuItem(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded-lg transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
