import { Injectable } from '@nestjs/common';
import { R2Service } from '../r2/r2.service';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly r2Service: R2Service) {}

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\-]/g, '')
      .trim();
  }

  private async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg(filePath).ffprobe((err, metadata) => {
        if (err) reject(err);
        else {
          const durationInSeconds = metadata.format.duration ?? 0;
          let durationInMinutes: number;
          if (typeof metadata.format.duration !== 'number') {
            durationInMinutes = 0;
          } else {
            durationInMinutes = Math.floor(durationInSeconds / 60);
          }
          resolve(durationInMinutes);
        }
      });
    });
  }

  async handleVideoUpload(
    file: Express.Multer.File,
    course: string,
    lesson: string,
  ): Promise<{ url: string; duration: number }> {
    const uploadDirectory = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const tempFilePath = path.join(uploadDirectory, file.originalname);
    fs.writeFileSync(tempFilePath, file.buffer);

    const duration = await this.getVideoDuration(tempFilePath);

    const url = await this.r2Service.uploadFile(
      file,
      'lessons',
      this.generateSlug(course),
      lesson,
    );

    return { url, duration };
  }

  async handleThumbnailUpload(
    file: Express.Multer.File,
    course: string,
  ): Promise<{ url: string }> {
    const url = await this.r2Service.uploadThumbnail(
      file,
      'thumbnails',
      this.generateSlug(course),
    );

    return { url };
  }
}
