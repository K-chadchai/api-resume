import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UploaderService } from 'src/uploader/uploader.service';

@Controller('media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly uploaderService: UploaderService,
  ) {}

  @Get('image/:key')
  getImage(@Param('key') key) {
    // key = 'images/001/475909f9-0054-4276-a2ff-b3a69c8fb96a-x'
    try {
      return this.uploaderService.getImageBody(key);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
