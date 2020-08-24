import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';
import { MediaFolderService } from './media-folder.service';

@Crud({
  model: { type: MediaFolderEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-folder')
export class MediaFolderController {
  constructor(public service: MediaFolderService) {}

  @Get('/paging')
  async get(@Query() query) {
    return await this.service.getPaging(query);
  }

  @Post('/init')
  async post() {
    return await this.service.postInit();
  }
}
