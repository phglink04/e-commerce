import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Plant, PlantDocument } from "../plants/schemas/plant.schema";
import { User, UserDocument } from "../users/schemas/user.schema";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";

@Injectable()
export class CartService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
  ) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const user = await this.userModel.findById(userId);
    const plant = await this.plantModel.findById(dto.plantId);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!plant) {
      throw new NotFoundException("Plant not found");
    }

    if (plant.availability === "Out Of Stock") {
      throw new BadRequestException("This plant is currently out of stock");
    }

    const existingItem = user.cart.find(
      (item) => String(item.plantId) === dto.plantId,
    );

    const totalRequestedQty = existingItem
      ? existingItem.quantity + dto.quantity
      : dto.quantity;

    if (totalRequestedQty > plant.quantity) {
      throw new BadRequestException(
        `Only ${plant.quantity} quantities are in stock`,
      );
    }

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      existingItem.price = dto.price;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      user.cart.push({
        plantId: plant._id,
        quantity: dto.quantity,
        price: dto.price,
        total: dto.quantity * dto.price,
      } as any);
    }

    await user.save({ validateBeforeSave: false });

    return {
      status: "success",
      cart: user.cart,
    };
  }

  async updateCart(userId: string, dto: UpdateCartDto) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.cart) {
      throw new BadRequestException("Cart is empty");
    }

    const item = user.cart.find(
      (cartItem) => String(cartItem.plantId) === dto.plantId,
    );
    if (!item) {
      throw new NotFoundException("Item not found in cart");
    }

    const plant = await this.plantModel.findById(dto.plantId);
    if (!plant) {
      throw new NotFoundException("Plant not found");
    }

    const nextQuantity = dto.quantity ?? item.quantity;
    if (nextQuantity > plant.quantity) {
      throw new BadRequestException(
        `Only ${plant.quantity} quantities are in stock`,
      );
    }

    if (dto.quantity !== undefined) {
      item.quantity = dto.quantity;
    }
    if (dto.price !== undefined) {
      item.price = dto.price;
    }
    item.total = item.quantity * item.price;

    await user.save({ validateBeforeSave: false });

    return {
      status: "success",
      cart: user.cart,
    };
  }

  async deleteCartItem(userId: string, plantId: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.cart) {
      throw new NotFoundException("User or cart not found");
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(
      (item) => String(item.plantId) !== plantId,
    ) as any;

    if (user.cart.length === initialLength) {
      throw new NotFoundException("Item not found in cart");
    }

    await user.save({ validateBeforeSave: false });

    return {
      status: "success",
      cart: user.cart,
    };
  }

  async getCart(userId: string) {
    const user = await this.userModel.findById(userId).populate({
      path: "cart.plantId",
      model: Plant.name,
    });

    if (!user || !user.cart) {
      throw new NotFoundException("User or cart not found");
    }

    return {
      status: "success",
      cart: user.cart,
    };
  }

  async clearCart(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.cart) {
      throw new NotFoundException("User or cart not found");
    }

    user.cart = [];
    await user.save({ validateBeforeSave: false });

    return {
      status: "success",
      message: "Cart cleared successfully",
      cart: user.cart,
    };
  }

  async getCartTotal(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.cart) {
      throw new NotFoundException("User or cart not found");
    }

    const total = user.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      status: "success",
      cartTotal: total,
    };
  }

  async checkCartAvailability(userId: string) {
    const user = await this.userModel.findById(userId).populate("cart.plantId");

    if (!user || !user.cart || user.cart.length === 0) {
      throw new BadRequestException("Cart is empty or user not found");
    }

    const unavailableItems: Array<Record<string, string | number>> = [];

    for (const item of user.cart) {
      const plantId = (item.plantId as any)?._id ?? item.plantId;
      const plant = await this.plantModel.findById(plantId);

      if (!plant) {
        unavailableItems.push({
          name: "[Deleted Plant]",
          message: "Plant no longer exists",
        });
        continue;
      }

      if (plant.quantity < item.quantity) {
        unavailableItems.push({
          name: plant.name,
          requested: item.quantity,
          available: plant.quantity,
          message: `Only ${plant.quantity} left in stock`,
        });
      } else if (plant.availability === "Out Of Stock") {
        unavailableItems.push({
          name: plant.name,
          requested: item.quantity,
          available: 0,
          message: "Currently out of stock",
        });
      }
    }

    if (unavailableItems.length > 0) {
      return {
        status: "fail",
        message:
          "Some items in your cart are no longer available in the desired quantity",
        unavailableItems,
      };
    }

    return {
      status: "success",
      message: "All items in cart are available for checkout",
    };
  }
}
