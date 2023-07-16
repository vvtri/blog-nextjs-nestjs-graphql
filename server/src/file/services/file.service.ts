import { Injectable } from '@nestjs/common';
import { runOnTransactionRollback, Transactional } from 'typeorm-transactional';
import { FileRepository } from '../repositories/file.repository';
import { FileUpload } from '../types/file.type';
import mime from 'mime-types';
import cloudinary from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../common/configs/app.config';
import { Stream } from 'stream';

@Injectable()
export class FileService {
  constructor(
    private fileRepo: FileRepository,
    private configService: ConfigService<AppConfig>,
  ) {}

  @Transactional()
  async uploadFile(fileUpload: FileUpload, userId: number) {
    const { createReadStream, filename } = fileUpload;

    const mimetype = mime.lookup(filename);
    if (!mimetype || !mimetype.includes('image'))
      throw new Error('invalid file');

    const readStream = createReadStream();

    const uploadResult = await this.uploadToCloudinaryByStream(readStream);

    const file = this.fileRepo.create({
      mimetype,
      userId,
      publicId: uploadResult.public_id,
      url: uploadResult.secure_url,
    });

    await this.fileRepo.save(file);
    return file;
  }

  @Transactional()
  private async uploadToCloudinaryByStream(stream: Stream) {
    const uploadResult = await new Promise<cloudinary.UploadApiResponse>(
      (res, rej) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { upload_preset: this.configService.get('cloudinary.preset') },
          (error, uploadResult) => {
            if (error) rej(error);

            res(uploadResult);
          },
        );
        stream.pipe(uploadStream);
      },
    );

    runOnTransactionRollback(async () => {
      try {
        await cloudinary.v2.uploader.destroy(uploadResult.public_id);
      } catch (error) {
        console.log('error when delete unused file', error);
      }
    });

    return uploadResult;
  }
}
