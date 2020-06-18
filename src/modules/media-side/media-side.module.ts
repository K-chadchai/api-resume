import { Module } from '@nestjs/common';
import { MediaSideController } from './media-side.controller';
import { MediaSideService } from './media-side.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSideEntity } from 'src/entities/media_side.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaSideEntity])],
  controllers: [MediaSideController],
  providers: [MediaSideService]
})
export class MediaSideModule { }
