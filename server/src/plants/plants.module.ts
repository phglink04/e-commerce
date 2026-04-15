import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Plant, PlantSchema } from "./schemas/plant.schema";
import { PlantsController } from "./plants.controller";
import { PlantsService } from "./plants.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plant.name, schema: PlantSchema }]),
  ],
  controllers: [PlantsController],
  providers: [PlantsService],
  exports: [PlantsService, MongooseModule],
})
export class PlantsModule {}
