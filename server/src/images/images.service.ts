import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class ImagesService {
  private readonly bucketName = "plantworld-images";
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException(
        "SUPABASE_URL or SUPABASE_KEY is missing",
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  private buildUniqueFilename(originalname: string) {
    const safeName = originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    return `${Date.now()}_${safeName}`;
  }

  private extractFilePathFromUrl(fileUrl: string) {
    try {
      const parsed = new URL(fileUrl);
      const marker = `/${this.bucketName}/`;
      const markerIndex = parsed.pathname.indexOf(marker);

      if (markerIndex === -1) {
        throw new BadRequestException("Invalid Supabase file URL");
      }

      const filePath = decodeURIComponent(
        parsed.pathname.slice(markerIndex + marker.length),
      );

      if (!filePath) {
        throw new BadRequestException("Unable to extract file path from URL");
      }

      return filePath;
    } catch {
      throw new BadRequestException("Invalid file URL");
    }
  }

  async uploadImage(file: UploadedImageFile | undefined) {
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    if (!file.mimetype.startsWith("image/")) {
      throw new BadRequestException("Only image uploads are allowed");
    }

    const filename = this.buildUniqueFilename(file.originalname);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to upload image: ${error.message}`,
      );
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(filename);

    return {
      status: "success",
      publicUrl,
      file: {
        filename,
        path: filename,
        publicUrl,
      },
    };
  }

  async deleteImage(fileUrl: string | undefined) {
    if (!fileUrl) {
      return { status: "success", deleted: false };
    }

    const filePath = this.extractFilePathFromUrl(fileUrl);

    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) {
      throw new InternalServerErrorException(
        `Failed to delete image: ${error.message}`,
      );
    }

    return {
      status: "success",
      deleted: true,
      filePath,
    };
  }

  async getImageStream(
    filename: string,
  ): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    throw new NotFoundException(
      `Image stream endpoint is no longer supported with Supabase storage: ${filename}`,
    );
  }
}
