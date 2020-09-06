import { Module } from '@nestjs/common';
import { MediaResolutionController } from './media-resolution.controller';
import { MediaResolutionService } from './media-resolution.service';
import { MediaResolutionEntity } from 'src/entities/media_resolution.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaResolutionEntity])],
  controllers: [MediaResolutionController],
  providers: [MediaResolutionService, AppService],
})
export class MediaResolutionModule {}
