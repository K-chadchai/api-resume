import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';

@Module({
  providers: [UploaderService],
  controllers: [UploaderController],
})
export class UploaderModule {}
