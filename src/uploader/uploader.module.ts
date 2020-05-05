import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';
import { AppService } from 'src/app.service';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [MediaModule],
  providers: [UploaderService, AppService],
  exports: [UploaderService],
  controllers: [UploaderController],
})
export class UploaderModule {}
