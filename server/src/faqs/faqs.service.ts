import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateFaqDto } from "./dto/create-faq.dto";
import { UpdateFaqDto } from "./dto/update-faq.dto";
import { Faq, FaqDocument } from "./schemas/faq.schema";

@Injectable()
export class FaqsService {
  constructor(
    @InjectModel(Faq.name) private readonly faqModel: Model<FaqDocument>,
  ) {}

  async getAll() {
    const faqs = await this.faqModel.find();
    return {
      status: "success",
      results: faqs.length,
      data: { faqs },
    };
  }

  async getById(id: string) {
    const faq = await this.faqModel.findById(id);
    if (!faq) {
      throw new NotFoundException("FAQ not found");
    }

    return {
      status: "success",
      data: { faq },
    };
  }

  async create(dto: CreateFaqDto) {
    const faq = await this.faqModel.create(dto);
    return {
      status: "success",
      data: { faq },
    };
  }

  async update(id: string, dto: UpdateFaqDto) {
    const faq = await this.faqModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      throw new NotFoundException("FAQ not found");
    }

    return {
      status: "success",
      data: { faq },
    };
  }

  async remove(id: string) {
    const faq = await this.faqModel.findByIdAndDelete(id);
    if (!faq) {
      throw new NotFoundException("FAQ not found");
    }

    return {
      status: "success",
      data: null,
    };
  }
}
