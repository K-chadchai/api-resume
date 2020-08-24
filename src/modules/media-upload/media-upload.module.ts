import { Module, HttpModule } from '@nestjs/common';
import { MediaUploadController } from './media-upload.controller';
import { MediaUploadService } from './media-upload.service';
import { AppService } from 'src/app/app.service';
import { UploaderService } from 'src/services/uploader.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [MediaUploadController],
  providers: [MediaUploadService, AppService, UploaderService],
})
export class MediaUploadModule {}
