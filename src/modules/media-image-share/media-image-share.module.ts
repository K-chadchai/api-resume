import { Module } from '@nestjs/common';
import { MediaImageShareService } from './media-image-share.service';
import { MediaImageShareController } from './media-image-share.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaImageShareEntity } from 'src/entities/media_image_share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaImageShareEntity])],
  providers: [MediaImageShareService, AppService],
  controllers: [MediaImageShareController]
})
export class MediaImageShareModule { }
