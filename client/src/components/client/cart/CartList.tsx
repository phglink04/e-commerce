import { FC } from "react";
import CartItem, { CartItemProps } from "./CartItem";

interface CartListProps {
  items: CartItemProps["item"][];
  onIncrease: (plantId: string, quantity: number) => void;
  onDecrease: (plantId: string, quantity: number) => void;
  onRemove: (plantId: string) => void;
}

const CartList: FC<CartListProps> = ({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;
