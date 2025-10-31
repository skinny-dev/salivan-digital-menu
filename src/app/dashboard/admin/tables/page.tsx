"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ArrowLeft,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";

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

export default function TableManagement() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [showAddTable, setShowAddTable] = useState(false);
  const [tableForm, setTableForm] = useState<TableForm>({
    number: 1,
    name: "",
    capacity: 4,
    isActive: true,
  });
  const router = useRouter();

   
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
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

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
          <div className="text-2xl font-bold text-white">{tables.length}</div>
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
            {tables.reduce((sum, t) => sum + (t.isActive ? t.capacity : 0), 0)}{" "}
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
                      onClick={() => handleUpdateTable(table.id, tableForm)}
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
                  <div className="text-3xl font-bold mb-2">{table.number}</div>
                  <div className="text-sm text-zinc-400 mb-1">{table.name}</div>
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
                    {table.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-md mx-4">
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
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddTable}
                className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg transition-colors"
              >
                افزودن
              </button>
              <button
                onClick={() => setShowAddTable(false)}
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
