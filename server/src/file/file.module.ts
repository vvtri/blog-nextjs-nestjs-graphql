import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { FileRepository } from './repositories/file.repository';
import { FileService } from './services/file.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([FileRepository])],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
