import { Controller, Post, Res, Req, Query } from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  // @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  async uploadFile2(@Req() req, @Res() res, @Query() query) {
    try {
      return await this.uploaderService.uploadMedia(req, res, query);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
