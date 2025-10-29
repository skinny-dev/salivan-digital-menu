"use client";

import { useState, useEffect } from "react";
import SimpleQuantitySelector from "@/app/components/simpleQuantitySelector";
import {
  Plus,
  Users,
  MapPin,
  Package,
  Search,
  UserPlus,
  X,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  emoji?: string;
  isActive: boolean;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  isActive: boolean;
  isAvailable: boolean;
  categoryId: string;
}

interface Table {
  id: string;
  number: number;
  name: string;
  capacity: number;
  isActive: boolean;
}

interface Customer {
  id: string;
  name: string;
  lastName?: string;
  phone: string;
  membershipCode: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
}

interface OrderPanelProps {
  onOrderSubmit: (order: any) => void;
  isSubmitting?: boolean;
}

export default function OrderPanel({
  onOrderSubmit,
  isSubmitting = false,
}: OrderPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [currentOrder, setCurrentOrder] = useState<{
    phone: string;
    orderType: string;
    address: string;
    customerId?: string;
    tableId?: string;
    items: (MenuItem & { quantity: number })[];
  }>({
    phone: "",
    orderType: "DINE_IN",
    address: "",
    items: [],
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    fetchMenu();
    // Fetch customers by search
    const handleCustomerSearch = async (query: string) => {
      setLoadingCustomers(true);
      try {
        const res = await fetch(
          `/api/customers?search=${encodeURIComponent(query)}`
        );
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (e) {}
      setLoadingCustomers(false);
    };

    // Select customer and autofill phone
    const handleSelectCustomer = (customer: Customer) => {
      setSelectedCustomer(customer);
      setCurrentOrder((order) => ({
        ...order,
        phone: customer.phone,
        address: customer.address || "",
      }));
      setShowCustomerSearch(false);
    };
    fetchTables();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("/api/menu");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await fetch("/api/tables");
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      setCustomers([]);
      return;
    }

    setLoadingCustomers(true);
    try {
      const response = await fetch(
        `/api/customers?search=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCurrentOrder((prev) => ({
      ...prev,
      customerId: customer.id,
      phone: customer.phone,
    }));
    setShowCustomerSearch(false);
    setSearchCustomer("");
    setCustomers([]);
  };

  const createNewCustomer = async (customerData: {
    name: string;
    lastName?: string;
    phone: string;
    address?: string;
  }) => {
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        const newCustomer = await response.json();
        selectCustomer(newCustomer);
        return newCustomer;
      }
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const addToOrder = (item: MenuItem) => {
    const existingItem = currentOrder.items.find((i) => i.id === item.id);
    if (existingItem) {
      setCurrentOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }));
    } else {
      setCurrentOrder((prev) => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1 }],
      }));
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setCurrentOrder((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== itemId),
      }));
    } else {
      setCurrentOrder((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
      }));
    }
  };

  const handleSubmitOrder = () => {
    if (!currentOrder.phone || currentOrder.items.length === 0) return;
    if (currentOrder.orderType === "DINE_IN" && !currentOrder.tableId) return;
    if (currentOrder.orderType === "DELIVERY" && !currentOrder.address) return;

    const totalAmount = currentOrder.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderData = {
      ...currentOrder,
      totalAmount,
      items: currentOrder.items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        menuItemId: item.id,
      })),
    };

    onOrderSubmit(orderData);

    // Reset form after submit
    setCurrentOrder({
      phone: "",
      orderType: "DINE_IN",
      address: "",
      customerId: undefined,
      tableId: undefined,
      items: [],
    });
    setSelectedCustomer(null);
    setSelectedTable(null);
  };

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const totalOrderAmount = currentOrder.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isValidOrder =
    currentOrder.phone &&
    currentOrder.items.length > 0 &&
    (currentOrder.orderType !== "DINE_IN" || currentOrder.tableId) &&
    (currentOrder.orderType !== "DELIVERY" || currentOrder.address);

  return (
    <div className="w-[480px] bg-zinc-900 p-6 flex-shrink-0 border-l border-zinc-800 flex flex-col">
      {/* Categories */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-2 rounded-lg text-center transition-colors ${
              selectedCategory === category.id
                ? "bg-orange-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            <div className="text-lg mb-1">{category.emoji}</div>
            <div className="text-xs truncate">{category.name}</div>
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
        {currentCategory?.menuItems.map((item) => {
          const orderItem = currentOrder.items.find((i) => i.id === item.id);
          const isSelected = !!orderItem;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isSelected
                  ? "bg-orange-600 border-2 border-orange-400"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-zinc-400">
                  {item.price.toLocaleString()} تومان
                </div>
              </div>
              {isSelected ? (
                <SimpleQuantitySelector
                  quantity={orderItem.quantity}
                  onQuantityChange={(quantity) =>
                    updateItemQuantity(item.id, quantity)
                  }
                  min={0}
                />
              ) : (
                <button
                  onClick={() => addToOrder(item)}
                  className="bg-orange-600 hover:bg-orange-700 p-2 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Form */}
      <div className="space-y-4 flex-1">
        {/* Customer Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-300">مشتری</label>
            <button
              onClick={() => setShowCustomerSearch(!showCustomerSearch)}
              className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
            >
              <Search size={12} />
              جستجو مشتری
            </button>
          </div>

          {selectedCustomer ? (
            <div className="bg-zinc-800 rounded-lg p-3 border border-green-400">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">
                    {selectedCustomer.name} {selectedCustomer.lastName}
                  </div>
                  <div className="text-xs text-zinc-400">
                    {selectedCustomer.phone}
                  </div>
                  <div className="text-xs text-zinc-400">
                    کد عضویت: {selectedCustomer.membershipCode}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setCurrentOrder((prev) => ({
                      ...prev,
                      customerId: undefined,
                      phone: "",
                    }));
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <input
              type="tel"
              placeholder="شماره تماس مشتری"
              value={currentOrder.phone}
              onChange={(e) =>
                setCurrentOrder((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none"
            />
          )}

          {/* Customer Search Modal */}
          {showCustomerSearch && (
            <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">جستجو مشتری</h3>
                <button
                  onClick={() => {
                    setShowCustomerSearch(false);
                    setSearchCustomer("");
                    setCustomers([]);
                  }}
                  className="text-zinc-400 hover:text-zinc-300"
                >
                  <X size={16} />
                </button>
              </div>

              <input
                type="text"
                placeholder="نام، نام خانوادگی، شماره تماس یا کد عضویت"
                value={searchCustomer}
                onChange={(e) => {
                  setSearchCustomer(e.target.value);
                  searchCustomers(e.target.value);
                }}
                className="w-full p-2 bg-zinc-900 rounded border border-zinc-600 focus:border-green-400 outline-none text-sm"
              />

              {loadingCustomers && (
                <div className="text-center text-zinc-400 text-xs py-2">
                  در حال جستجو...
                </div>
              )}

              {customers.length > 0 && (
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => selectCustomer(customer)}
                      className="w-full text-right p-2 bg-zinc-900 hover:bg-zinc-700 rounded border border-zinc-600 hover:border-green-400 transition-colors"
                    >
                      <div className="text-sm font-medium">
                        {customer.name} {customer.lastName}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {customer.phone} - {customer.membershipCode}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  // For now, just close the search and allow manual entry
                  setShowCustomerSearch(false);
                  setSearchCustomer("");
                  setCustomers([]);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2 rounded text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus size={14} />
                ایجاد مشتری جدید
              </button>
            </div>
          )}
        </div>

        <select
          value={currentOrder.orderType}
          onChange={(e) =>
            setCurrentOrder((prev) => ({ ...prev, orderType: e.target.value }))
          }
          className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700"
        >
          <option value="DINE_IN">سرو در رستوران</option>
          <option value="DELIVERY">ارسال با پیک</option>
          <option value="PICKUP">تحویل حضوری</option>
        </select>

        {currentOrder.orderType === "DINE_IN" && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">میز</label>
            {selectedTable ? (
              <div className="bg-zinc-800 rounded-lg p-3 border border-green-400">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {selectedTable.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      ظرفیت: {selectedTable.capacity} نفر
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTable(null);
                      setCurrentOrder((prev) => ({
                        ...prev,
                        tableId: undefined,
                      }));
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <select
                value={currentOrder.tableId || ""}
                onChange={(e) => {
                  const tableId = e.target.value;
                  const table = tables.find((t) => t.id === tableId);
                  setSelectedTable(table || null);
                  setCurrentOrder((prev) => ({ ...prev, tableId }));
                }}
                className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400"
              >
                <option value="">انتخاب میز</option>
                {tables
                  .filter((table) => table.isActive)
                  .map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.name} ({table.capacity} نفره)
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}

        {currentOrder.orderType === "DELIVERY" && (
          <textarea
            placeholder="آدرس کامل"
            value={currentOrder.address}
            onChange={(e) =>
              setCurrentOrder((prev) => ({ ...prev, address: e.target.value }))
            }
            className="w-full p-3 bg-zinc-800 rounded-lg border border-zinc-700 focus:border-green-400 outline-none h-20 resize-none"
          />
        )}
      </div>

      {/* Current Order Items - Fixed Bottom */}
      {currentOrder.items.length > 0 && (
        <div className="bg-zinc-800 p-4 rounded-lg mb-4 mt-auto">
          <h4 className="font-medium mb-3">
            آیتم‌های سفارش ({currentOrder.items.length})
          </h4>
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>
                  {(item.price * item.quantity).toLocaleString()} تومان
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-700 pt-3 flex justify-between font-medium">
            <span>مجموع:</span>
            <span className="text-green-400">
              {totalOrderAmount.toLocaleString()} تومان
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleSubmitOrder}
        disabled={!isValidOrder || isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {isSubmitting ? "در حال ثبت..." : "ثبت سفارش"}
        {totalOrderAmount > 0 && !isSubmitting && (
          <span className="mr-2">
            ({totalOrderAmount.toLocaleString()} تومان)
          </span>
        )}
      </button>
    </div>
  );
}
