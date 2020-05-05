import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UploaderService } from 'src/services/uploader.service';
import { Crud } from '@nestjsx/crud';
import { MediaEntity } from 'src/entities/media.entity';

@Crud({
  model: { type: MediaEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media')
export class MediaController {
  constructor(
    public service: MediaService,
    private readonly uploaderService: UploaderService,
  ) {}

  // Upload media file
  // @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  async uploadFile2(@Req() req, @Res() res, @Query() query) {
    try {
      return await this.service.uploadMedia(req, res, query);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  // Get image body
  @Get('image')
  async getImageBody(@Query('key') key) {
    return this.uploaderService.getImageBody(key);
  }
}
