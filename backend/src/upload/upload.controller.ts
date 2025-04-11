import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../r2/r2.service';
import * as ffmpeg from 'fluent-ffmpeg'; // Correct way

import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2Service: R2Service) {}

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { course: string; lesson: string },
  ) {
    // Video duration calculation using ffmpeg
    const getVideoDuration = (path: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        ffmpeg(path).ffprobe((err, metadata) => {
          if (err) {
            reject(err);
          } else {
            const durationInSeconds = metadata.format.duration ?? 0;
            const durationInMinutes = Math.floor(durationInSeconds / 60); // Convert to minutes and floor
            resolve(durationInMinutes); // Return minutes without decimals
          }
        });
      });
    };

    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\-]/g, '')
        .trim();
    };

    // Ensure the uploads directory exists
    const uploadDirectory = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    // Save the file to temporary storage (before uploading it to Cloudflare R2)
    const tempFilePath = path.join(uploadDirectory, file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    // Get the video duration
    const videoDuration = await getVideoDuration(tempFilePath);
    // Upload the file to Cloudflare R2
    const url = await this.r2Service.uploadFile(
      file,
      'lessons',
      generateSlug(body.course),
      body.lesson,
    );

    // Optionally, you can return the duration along with the URL
    return { url, duration: videoDuration };
  }
}
