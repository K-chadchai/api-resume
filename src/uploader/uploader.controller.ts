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
import { MediaService } from 'src/media/media.service';
import { AppService } from 'src/app.service';

@Controller('uploader')
export class UploaderController {
  constructor(
    private readonly uploaderService: UploaderService,
    private readonly mediaService: MediaService,
    private readonly appService: AppService,
  ) {}

  @Post('upload')
  // @UseInterceptors(FilesInterceptor('files'))
  async uploadFile2(@Req() req, @Res() res, @Query() query) {
    // path = 'images/001'
    // folder = id of category_folder
    // if (!folder)
    //   return res
    //     .status(400)
    //     .json(`Failed to upload image file: Not found foolder`);
    //
    try {
      return await this.uploaderService.uploadFile2(
        req,
        res,
        query,
        async uploaded => {
          return await this.appService.dbRunner(async runner => {
            return await this.mediaService.uploadFile(runner, uploaded);
          });
        },
      );
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
