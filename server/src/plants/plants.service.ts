import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { ImagesService } from "../images/images.service";
import { CreatePlantDto } from "./dto/create-plant.dto";
import { UpdatePlantDto } from "./dto/update-plant.dto";
import { Plant, PlantDocument } from "./schemas/plant.schema";

@Injectable()
export class PlantsService {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
    private readonly imagesService: ImagesService,
  ) {}

  async getAll(query: Record<string, string>) {
    const filter: FilterQuery<PlantDocument> = {};

    if (query.availability) {
      filter.availability = query.availability;
    }

    if (query.search) {
      filter.name = { $regex: query.search, $options: "i" };
    }

    let dbQuery = this.plantModel.find(filter);

    if (query.sort) {
      dbQuery = dbQuery.sort(query.sort.split(",").join(" "));
    }

    const limit = Number(query.limit || 0);
    const page = Number(query.page || 1);

    if (limit > 0) {
      dbQuery = dbQuery.skip((page - 1) * limit).limit(limit);
    }

    const plants = await dbQuery.exec();

    return {
      status: "success",
      results: plants.length,
      data: { plants },
    };
  }

  getFeaturedProducts() {
    return this.getAll({ limit: "8", sort: "-ratingsAverage,price" });
  }

  async create(dto: CreatePlantDto) {
    const plant = await this.plantModel.create(dto);
    return {
      status: "success",
      data: { plant },
    };
  }

  async getById(id: string) {
    const plant = await this.plantModel.findById(id);
    if (!plant) {
      throw new NotFoundException("No plant found with that ID");
    }

    return {
      status: "success",
      data: { plant },
    };
  }

  async update(id: string, dto: UpdatePlantDto) {
    const existingPlant = await this.plantModel.findById(id);
    if (!existingPlant) {
      throw new NotFoundException("No plant found with that ID");
    }

    if (dto.quantity !== undefined) {
      if (dto.quantity <= 0) {
        dto.availability = "Out Of Stock";
      }
      if (dto.quantity > 0 && !dto.availability) {
        dto.availability = "In Stock";
      }
    }

    const plant = await this.plantModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (
      dto.imageCover &&
      existingPlant.imageCover &&
      dto.imageCover !== existingPlant.imageCover
    ) {
      await this.imagesService
        .deleteImage(existingPlant.imageCover)
        .catch(() => {
          return null;
        });
    }

    return {
      status: "success",
      data: { plant },
    };
  }

  async remove(id: string) {
    const plant = await this.plantModel.findByIdAndDelete(id);
    if (!plant) {
      throw new NotFoundException("No plant found with that ID");
    }

    if (plant.imageCover) {
      await this.imagesService.deleteImage(plant.imageCover).catch(() => {
        return null;
      });
    }

    return {
      status: "success",
      data: null,
    };
  }

  async getPlantStats() {
    const stats = await this.plantModel.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: "$category" },
          numPlants: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      { $sort: { avgPrice: 1 } },
    ]);

    return {
      status: "success",
      data: { stats },
    };
  }

  async getTotalPlants() {
    const totalPlants = await this.plantModel.countDocuments();
    return {
      status: "success",
      totalPlants,
      data: null,
    };
  }

  getByAvailability(availability: string) {
    const normalized = availability
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return this.getAll({ availability: normalized });
  }
}
