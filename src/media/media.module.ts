import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from 'src/entities/media.entity';
import { UploaderService } from 'src/services/uploader.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  providers: [MediaService, AppService, UploaderService],
  exports: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
