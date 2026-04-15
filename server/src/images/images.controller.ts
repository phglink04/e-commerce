import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { ImagesService } from "./images.service";

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("image"))
  uploadImage(
    @UploadedFile()
    file:
      | { originalname: string; mimetype: string; buffer: Buffer }
      | undefined,
  ) {
    return this.imagesService.uploadImage(file);
  }

  @Get(":filename")
  async getImage(@Param("filename") filename: string, @Res() res: Response) {
    const { stream, contentType } =
      await this.imagesService.getImageStream(filename);
    res.setHeader("Content-Type", contentType);
    stream.pipe(res);
  }
}
