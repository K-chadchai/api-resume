import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';
import { MediaService } from 'src/media/media.service';
import { AppService } from 'src/app.service';

@Module({
  providers: [UploaderService, MediaService, AppService],
  controllers: [UploaderController],
})
export class UploaderModule {}
