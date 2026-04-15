import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { Role } from "../common/constants/roles.constant";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { FaqsService } from "./faqs.service";

@Controller("faqs")
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get()
  getAllFaqs() {
    return this.faqsService.getAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  createFaq(@Body() dto: CreateFaqDto) {
    return this.faqsService.create(dto);
  }

  @Get(":id")
  getFaq(@Param("id") id: string) {
    return this.faqsService.getById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  updateFaq(@Param("id") id: string, @Body() dto: UpdateFaqDto) {
    return this.faqsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  deleteFaq(@Param("id") id: string) {
    return this.faqsService.remove(id);
  }
}
