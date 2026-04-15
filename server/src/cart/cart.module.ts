import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Plant, PlantSchema } from "../plants/schemas/plant.schema";
import { User, UserSchema } from "../users/schemas/user.schema";
import { CartController, CartMergeController } from "./cart.controller";
import { CartService } from "./cart.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Plant.name, schema: PlantSchema },
    ]),
  ],
  controllers: [CartController, CartMergeController],
  providers: [CartService],
})
export class CartModule {}
