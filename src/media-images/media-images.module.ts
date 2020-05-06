import { Module } from '@nestjs/common';
import { MediaImagesController } from './media-images.controller';
import { MediaImagesService } from './media-images.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaImagesEntity } from 'src/entities/media-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaImagesEntity])],
  controllers: [MediaImagesController],
  providers: [MediaImagesService],
  exports: [MediaImagesService],
})
export class MediaImagesModule {}
