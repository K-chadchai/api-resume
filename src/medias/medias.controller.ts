import { Controller, Query, Post, Req, Res } from '@nestjs/common';
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
  async uploadFile2(@Req() req, @Res() res, @Query() query) {
    try {
      return await this.service.uploadMedia(req, res, query);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
