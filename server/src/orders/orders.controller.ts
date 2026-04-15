import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Role } from "../common/constants/roles.constant";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Req() req: { user: { userId: string } },
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(req.user.userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER, Role.DELIVERY_PARTNER)
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get("myorders")
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Req() req: { user: { userId: string } }) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  @Get("myorders/:orderId")
  @UseGuards(JwtAuthGuard)
  getMyOrderById(
    @Req() req: { user: { userId: string } },
    @Param("orderId") orderId: string,
  ) {
    return this.ordersService.getMyOrderById(req.user.userId, orderId);
  }

  @Patch(":orderId/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER, Role.DELIVERY_PARTNER)
  updateOrderStatus(
    @Param("orderId") orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, dto);
  }

  @Patch(":orderId/cancel")
  @UseGuards(JwtAuthGuard)
  cancelOrder(
    @Req() req: { user: { userId: string } },
    @Param("orderId") orderId: string,
  ) {
    return this.ordersService.cancelOrder(req.user.userId, orderId);
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER, Role.DELIVERY_PARTNER)
  getOrderById(@Param("orderId") orderId: string) {
    return this.ordersService.getOrderById(orderId);
  }
}
