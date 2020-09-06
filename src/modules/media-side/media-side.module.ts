import { Module } from '@nestjs/common';
import { MediaSideController } from './media-side.controller';
import { MediaSideService } from './media-side.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaSideEntity])],
  providers: [MediaSideService, AppService],
  controllers: [MediaSideController],
})
export class MediaSideModule {}
