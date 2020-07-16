import { Module, HttpModule } from '@nestjs/common';
import { MediaUploadController } from './media-upload.controller';
import { MediaUploadService } from './media-upload.service';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [MediaUploadController],
  providers: [MediaUploadService, AppService],
})
export class MediaUploadModule {}
