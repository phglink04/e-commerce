import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { Role } from "../common/constants/roles.constant";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { CreatePlantDto } from "./dto/create-plant.dto";
import { UpdatePlantDto } from "./dto/update-plant.dto";
import { PlantsService } from "./plants.service";

@Controller("plants")
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Get("featured-products")
  getFeaturedProducts() {
    return this.plantsService.getFeaturedProducts();
  }

  @Get("plant-stats")
  getPlantStats() {
    return this.plantsService.getPlantStats();
  }

  @Get("plantTotal")
  getTotalPlants() {
    return this.plantsService.getTotalPlants();
  }

  @Get("availability/:availability")
  getPlantsByAvailability(@Param("availability") availability: string) {
    return this.plantsService.getByAvailability(availability);
  }

  @Get()
  getAllPlants(@Query() query: Record<string, string>) {
    return this.plantsService.getAll(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  createPlant(@Body() dto: CreatePlantDto) {
    return this.plantsService.create(dto);
  }

  @Get(":id")
  getPlant(@Param("id") id: string) {
    return this.plantsService.getById(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  updatePlant(@Param("id") id: string, @Body() dto: UpdatePlantDto) {
    return this.plantsService.update(id, dto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  deletePlant(@Param("id") id: string) {
    return this.plantsService.remove(id);
  }
}
