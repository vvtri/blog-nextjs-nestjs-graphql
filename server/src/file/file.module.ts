import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from '../typeorm-custom/typeorm-custom.module';
import { FileRepository } from './repositories/file.repository';
import { FileResolver } from './resolvers/file.resolver';
import { FileService } from './services/file.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([FileRepository])],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {}
