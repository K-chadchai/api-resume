import {
  Controller,
  Post,
  Res,
  Req,
  Get,
  Query,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploaderService } from './uploader.service';

@Controller('uploader')
export class UploaderController {
  constructor(private readonly appService: UploaderService) {}

  @Post('upload')
  // @UseInterceptors(FilesInterceptor('files'))
  async uploadFile2(@Req() req, @Res() res, @Query('path') path) {
    // path = 'images/001'
    try {
      return await this.appService.uploadFile2(req, res, path);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  @Get('fetch')
  fetchFile(@Query('key') key) {
    // key = 'images/001/475909f9-0054-4276-a2ff-b3a69c8fb96a-x'
    try {
      return this.appService.fetchFile(key);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
