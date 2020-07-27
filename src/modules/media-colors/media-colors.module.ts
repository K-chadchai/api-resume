import { Module } from '@nestjs/common';
import { MediaColorsService } from './media-colors.service';
import { AppService } from 'src/app/app.service';
import { MediaColorsEntity } from 'src/entities/media_colors.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaColorsController } from './media-colors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MediaColorsEntity])],
  providers: [MediaColorsService, AppService],
  controllers: [MediaColorsController],
})
export class MediaColorsModule {}
