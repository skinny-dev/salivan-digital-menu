import { MinusIcon, PlusIcon } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

interface QuantitySelectorProps {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
  };
}

export default function QuantitySelector({ item }: QuantitySelectorProps) {
  const { getItemQuantity, addItem, updateQuantity } = useCartStore();
  const quantity = getItemQuantity(item.id);

  const decrease = () => {
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1);
    }
  };

  const increase = () => {
    if (quantity === 0) {
      // First time adding item
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
      });
    } else {
      // Update existing item quantity
      updateQuantity(item.id, quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-2 ml-2">
      {quantity === 0 ? (
        <button
          onClick={increase}
          className="bg-zinc-700 hover:bg-zinc-700 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
        >
          افزودن
        </button>
      ) : (
        <div className="flex items-center gap-1 rounded-lg p-1">
          <button
            onClick={decrease}
            className="bg-zinc-700 hover:bg-zinc-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          >
            <MinusIcon size={16} />
          </button>
          <span className="text-white font-medium px-2 min-w-[24px] text-center">
            {quantity}
          </span>
          <button
            onClick={increase}
            className="bg-zinc-700 hover:bg-zinc-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
          >
            <PlusIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
