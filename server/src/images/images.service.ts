import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { GridFSBucket, ObjectId } from "mongodb";
import { Connection } from "mongoose";

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class ImagesService {
  private readonly bucketName = "uploads";

  constructor(@InjectConnection() private readonly connection: Connection) {}

  private getBucket(): GridFSBucket {
    if (!this.connection.db) {
      throw new InternalServerErrorException(
        "Database connection not initialized",
      );
    }

    return new GridFSBucket(this.connection.db, {
      bucketName: this.bucketName,
    });
  }

  async uploadImage(file: UploadedImageFile | undefined) {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image uploads are allowed");
    }

    const safeOriginalName = file.originalname.replace(/\s+/g, "_");
    const filename = `plant_${Date.now()}_${safeOriginalName}`;

    const bucket = this.getBucket();

    const uploaded = await new Promise<{ id: ObjectId; filename: string }>(
      (resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filename, {
          contentType: file.mimetype,
        });

        uploadStream.on("error", () => {
          reject(new InternalServerErrorException("Failed to upload image"));
        });

        uploadStream.on(
          "finish",
          (result: { _id: ObjectId; filename: string }) => {
            resolve({ id: result._id, filename: result.filename });
          },
        );

        uploadStream.end(file.buffer);
      },
    );

    return {
      status: "success",
      file: {
        id: String(uploaded.id),
        filename: uploaded.filename,
        url: `/images/${uploaded.filename}`,
      },
    };
  }

  async getImageStream(filename: string) {
    if (!this.connection.db) {
      throw new InternalServerErrorException(
        "Database connection not initialized",
      );
    }

    const bucket = this.getBucket();
    const files = await this.connection.db
      .collection(`${this.bucketName}.files`)
      .find({ filename })
      .toArray();

    const file = files[0] as { contentType?: string } | undefined;

    if (!file || !file.contentType?.startsWith("image")) {
      throw new NotFoundException("Image not found");
    }

    const stream = bucket.openDownloadStreamByName(filename);
    return { stream, contentType: file.contentType };
  }
}
