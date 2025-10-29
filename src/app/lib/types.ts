type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  image?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Order = {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  items: MenuItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};
