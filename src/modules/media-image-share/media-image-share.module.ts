import { Module } from '@nestjs/common';
import { MediaImageShareService } from './media-image-share.service';
import { MediaImageShareController } from './media-image-share.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';
import { UploaderService } from 'src/services/uploader.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaImageShareEntity])],
  providers: [MediaImageShareService, AppService, UploaderService],
  controllers: [MediaImageShareController],
})
export class MediaImageShareModule {}
