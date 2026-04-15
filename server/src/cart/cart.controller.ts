import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { AddToCartDto } from "./dto/add-to-cart.dto";
import { MergeCartDto } from "./dto/merge-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { CartService } from "./cart.service";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post("addtocart")
  addToCart(
    @Req() req: { user: { userId: string } },
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @Patch("updatecart")
  updateCart(
    @Req() req: { user: { userId: string } },
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateCart(req.user.userId, dto);
  }

  @Delete("deleteitem/:plantId")
  deleteCartItem(
    @Req() req: { user: { userId: string } },
    @Param("plantId") plantId: string,
  ) {
    return this.cartService.deleteCartItem(req.user.userId, plantId);
  }

  @Get("cart")
  getCart(@Req() req: { user: { userId: string } }) {
    return this.cartService.getCart(req.user.userId);
  }

  @Delete("clear-cart")
  clearCart(@Req() req: { user: { userId: string } }) {
    return this.cartService.clearCart(req.user.userId);
  }

  @Get("check-availability")
  checkCartAvailability(@Req() req: { user: { userId: string } }) {
    return this.cartService.checkCartAvailability(req.user.userId);
  }

  @Get("cart/total")
  getCartTotal(@Req() req: { user: { userId: string } }) {
    return this.cartService.getCartTotal(req.user.userId);
  }
}

@Controller("cart")
@UseGuards(JwtAuthGuard)
export class CartMergeController {
  constructor(private readonly cartService: CartService) {}

  @Post("merge")
  mergeCart(
    @Req() req: { user: { userId: string } },
    @Body() dto: MergeCartDto,
  ) {
    return this.cartService.mergeCart(req.user.userId, dto);
  }
}
