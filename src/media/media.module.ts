import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploaderService } from 'src/uploader/uploader.service';
import { AppService } from 'src/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from 'src/entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaEntity])],
  providers: [MediaService, UploaderService, AppService],
  controllers: [MediaController],
})
export class MediaModule {}
