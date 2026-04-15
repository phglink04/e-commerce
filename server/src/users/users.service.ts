import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Role } from "../common/constants/roles.constant";
import { AddDeliveryPartnerDto } from "./dto/add-delivery-partner.dto";
import { UpdateMeDto } from "./dto/update-me.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(payload: Partial<User>): Promise<UserDocument> {
    if (payload.password !== payload.passwordConfirm) {
      throw new BadRequestException("Passwords are not the same");
    }

    try {
      return await this.userModel.create(payload);
    } catch (error: unknown) {
      if ((error as { code?: number })?.code === 11000) {
        throw new ConflictException("Email or phone number already exists");
      }
      throw error;
    }
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email });
    if (includePassword) {
      query.select(
        "+password +passwordConfirm +passwordResetToken +passwordResetExpires",
      );
    }
    return query.exec();
  }

  async findById(
    id: string,
    includePassword = false,
  ): Promise<UserDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const query = this.userModel.findById(id);
    if (includePassword) {
      query.select(
        "+password +passwordConfirm +passwordResetToken +passwordResetExpires",
      );
    }
    return query.exec();
  }

  async findByPasswordResetToken(
    tokenHash: string,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        passwordResetToken: tokenHash,
        passwordResetExpires: { $gt: new Date() },
      })
      .select(
        "+password +passwordConfirm +passwordResetToken +passwordResetExpires",
      )
      .exec();
  }

  async getAllUsers() {
    const users = await this.userModel.find();
    return {
      status: "success",
      results: users.length,
      data: { users },
    };
  }

  async updateMe(userId: string, dto: UpdateMeDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      status: "success",
      data: { user },
    };
  }

  async deleteMe(userId: string) {
    await this.userModel.findByIdAndDelete(userId);
    return {
      status: "success",
      data: null,
    };
  }

  async addDeliveryPartner(dto: AddDeliveryPartnerDto) {
    const partner = await this.createUser({
      ...dto,
      role: Role.DELIVERY_PARTNER,
    });

    return {
      status: "success",
      message: "Delivery Partner added successfully",
      data: { user: partner },
    };
  }

  async deleteDeliveryPartner(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("Delivery Partner not found");
    }

    if (user.role !== Role.DELIVERY_PARTNER) {
      throw new BadRequestException(
        "Only delivery partner accounts can be deleted from this endpoint",
      );
    }

    await this.userModel.findByIdAndDelete(id);

    return {
      status: "success",
      message: "Delivery Partner deleted successfully",
      data: null,
    };
  }
}
