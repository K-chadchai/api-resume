import { Controller } from '@nestjs/common';
import { MediaImagesService } from './media-images.service';
import { Crud } from '@nestjsx/crud';
import { MediaImagesEntity } from 'src/entities/media_images.entity';

@Crud({
  model: { type: MediaImagesEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-images')
export class MediaImagesController {
  constructor(public service: MediaImagesService) {}
}
