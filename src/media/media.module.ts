import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploaderService } from 'src/uploader/uploader.service';
import { AppService } from 'src/app.service';

@Module({
  providers: [MediaService, UploaderService, AppService],
  controllers: [MediaController],
})
export class MediaModule {}
