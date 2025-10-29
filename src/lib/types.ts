// Menu item from Google Sheets
export type MenuItem = Record<string, string>;

// Cart item with selected quantity
export interface CartItem {
  id: string; // item["عنوان"] - unique identifier
  title: string; // item["عنوان"] - display name
  price: number; // item["قیمت"] - price per item
  quantity: number; // user selected quantity
  image?: string; // item["تصویر"] - image path
  category: string; // item["نام دسته بندی"] - category name
  description?: string; // item["رسپی"] - recipe/description
  notes?: string; // special instructions (future use)
}

// Cart store interface
export interface CartStore {
  // State
  items: CartItem[];

  // Computed getters
  totalItems: number;
  totalPrice: number;

  // Actions
  addItem: (menuItem: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;

  // Persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}
