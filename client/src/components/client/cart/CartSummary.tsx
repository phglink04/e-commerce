import { FC } from "react";
import { formatVND } from "@/lib/currency";

interface CartSummaryProps {
  totalAmount: number;
  onProceed: () => void;
  onClear: () => void;
}

const CartSummary: FC<CartSummaryProps> = ({
  totalAmount,
  onProceed,
  onClear,
}) => {
  return (
    <div className="flex flex-col items-end mt-8">
      <div className="text-lg font-bold text-green-700 mb-2">
        Total: {formatVND(totalAmount)}
      </div>
      <div className="flex gap-3">
        <button className="btn btn-outline btn-error" onClick={onClear}>
          Clear Cart
        </button>
        <button className="btn btn-success" onClick={onProceed}>
          Proceed to Address
        </button>
      </div>
    </div>
  );
};

export default CartSummary;
