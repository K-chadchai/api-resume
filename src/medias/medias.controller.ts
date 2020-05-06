import {
  Controller,
  Query,
  Post,
  Req,
  Res,
  InternalServerErrorException,
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
  async uploadMedia(@Req() req, @Res() res, @Query() query) {
    try {
      return await this.service.uploadMedia(req, res, query);
    } catch (error) {
      throw new InternalServerErrorException('Media upload Error,');
    }
  }
}
