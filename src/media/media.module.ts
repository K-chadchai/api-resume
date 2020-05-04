import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploaderService } from 'src/uploader/uploader.service';

@Module({
  providers: [MediaService, UploaderService],
  controllers: [MediaController],
})
export class MediaModule {}
