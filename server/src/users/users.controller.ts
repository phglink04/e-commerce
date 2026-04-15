import {
  Body,
  Controller,
  Param,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Role } from "../common/constants/roles.constant";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { AddDeliveryPartnerDto } from "./dto/add-delivery-partner.dto";
import { UpdateMeDto } from "./dto/update-me.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Patch("updateMe")
  @UseGuards(JwtAuthGuard)
  updateMe(@Req() req: { user: { userId: string } }, @Body() dto: UpdateMeDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @Delete("deleteMe")
  @UseGuards(JwtAuthGuard)
  deleteMe(@Req() req: { user: { userId: string } }) {
    return this.usersService.deleteMe(req.user.userId);
  }

  @Post("add-delivery-partner")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  addDeliveryPartner(@Body() dto: AddDeliveryPartnerDto) {
    return this.usersService.addDeliveryPartner(dto);
  }

  @Delete("delivery-partner/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteDeliveryPartner(@Param("id") id: string) {
    return this.usersService.deleteDeliveryPartner(id);
  }
}
