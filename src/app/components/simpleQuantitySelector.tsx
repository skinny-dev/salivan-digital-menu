import { MinusIcon, PlusIcon } from "lucide-react";

interface SimpleQuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export default function SimpleQuantitySelector({
  quantity,
  onQuantityChange,
  min = 0,
  max = 99,
}: SimpleQuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-1 rounded-lg">
      <button
        onClick={decrease}
        disabled={quantity <= min}
        className="bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
      >
        <MinusIcon size={14} />
      </button>
      <span className="text-white font-medium px-2 min-w-[24px] text-center">
        {quantity}
      </span>
      <button
        onClick={increase}
        disabled={quantity >= max}
        className="bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors"
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}
