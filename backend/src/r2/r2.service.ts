import { Injectable } from '@nestjs/common';
// import { File } from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
// import { Readable } from 'stream';
import { config } from 'dotenv';
config();
@Injectable()
export class R2Service {
  private s3Client = new S3Client({
    region: 'auto', // Required by Cloudflare
    endpoint: process.env.Cloudflare_Endpoint,
    credentials: {
      accessKeyId: process.env.Cloudflare_AccessKeyId as string,
      secretAccessKey: process.env.Cloudflare_SecretAccessKey as string,
    },
  });

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

    return `${process.env.Cloudflare_Endpoint}/${bucket}/${key}`;
  }
}
