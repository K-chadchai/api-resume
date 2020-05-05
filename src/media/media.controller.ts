import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UploaderService } from 'src/uploader/uploader.service';
import { Crud } from '@nestjsx/crud';
import { MediaEntity } from 'src/entities/media.entity';

@Crud({
  model: {
    type: MediaEntity,
  },
})
@Controller('media')
export class MediaController {
  constructor(
    public service: MediaService,
    private readonly uploaderService: UploaderService,
  ) {}

  @Get('image')
  async getImageBody(@Query('key') key) {
    return this.uploaderService.getImageBody(key);
  }
}
