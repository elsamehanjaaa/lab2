import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../r2/r2.service';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2Service: R2Service) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\-]/g, '')
      .trim();
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { course: string; lesson: string },
  ) {
    const getVideoDuration = (path: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        ffmpeg(path).ffprobe((err, metadata) => {
          if (err) reject(err);
          else {
            const durationInSeconds = metadata.format.duration ?? 0;
            const durationInMinutes = Math.floor(durationInSeconds / 60);
            resolve(durationInMinutes);
          }
        });
      });
    };

    const uploadDirectory = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const tempFilePath = path.join(uploadDirectory, file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    const videoDuration = await getVideoDuration(tempFilePath);

    const url = await this.r2Service.uploadFile(
      file,
      'lessons',
      this.generateSlug(body.course),
      body.lesson,
    );

    return { url, duration: videoDuration };
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  async uploadThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { course: string },
  ) {
    const url = await this.r2Service.uploadThumbnail(
      file,
      'thumbnails',
      this.generateSlug(body.course),
    );

    return { url };
  }
}
