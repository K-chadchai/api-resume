import {
  Controller,
  Query,
  Post,
  Req,
  Res,
  Delete,
  Param,
  Get,
  Header,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { Crud } from '@nestjsx/crud';
import { MediasEntity } from 'src/entities/medias.entity';

@Crud({
  model: { type: MediasEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('medias')
export class MediasController {
  constructor(public service: MediasService) {}

  // Upload media file
  // @UseInterceptors(FilesInterceptor('files'))
  @Post('upload')
  async postUpload(@Req() req, @Res() res, @Query() query) {
    return await this.service.uploadMedia(req, res, query);
  }

  @Delete('upload/:id')
  async deleteUpload(@Param('id') id, @Query() query) {
    return await this.service.deleteUpload(id, query);
  }

  @Get('image/:id')
  async getImage(@Param('id') id, @Query('suffix') suffix) {
    return await this.service.getImage(id, suffix);
  }

  @Header('Content-Disposition', 'attachment; filename=test.png')
  @Header('Content-Type', 'image/png')
  @Get('download')
  async getDownload(@Query('s3key') s3key) {
    return await this.service.getDownload(s3key);
  }

  @Get('images/:folderId')
  async getImages(@Param('folderId') folderId, @Query('suffix') suffix) {
    return await this.service.getImages(folderId, suffix);
  }
}
