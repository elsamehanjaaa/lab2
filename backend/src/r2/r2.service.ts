import { Injectable } from '@nestjs/common';
// import { File } from 'multer';
import {
  PutObjectCommand,
  S3Client,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { v4 as uuid } from 'uuid';
// import { Readable } from 'stream';
import { config } from 'dotenv';
config();
@Injectable()
export class R2Service {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto', // Required by Cloudflare
      endpoint: process.env.Cloudflare_Endpoint,
      credentials: {
        accessKeyId: process.env.Cloudflare_AccessKeyId as string,
        secretAccessKey: process.env.Cloudflare_SecretAccessKey as string,
      },
      forcePathStyle: true,
    });
  }
  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    course: string,
    lesson: string,
  ): Promise<string> {
    const key = `${course}/${uuid()}/${lesson}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);
    return `${process.env.Cloudflare_Lessons_Public_Url}/${key}`;
  }

  async uploadThumbnail(
    file: Express.Multer.File,
    bucket: string,
    course: string,
  ): Promise<string> {
    const key = `${course}/thumbnail`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3Client.send(command);

    return `${process.env.Cloudflare_Thumbnail_Public_Url}/${key}`;
  }
  async deleteFile(bucket: string, key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const res = await this.s3Client.send(command);
  }
}
