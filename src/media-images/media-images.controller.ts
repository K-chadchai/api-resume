import { Controller } from '@nestjs/common';
import { MediaImagesService } from './media-images.service';
import { Crud } from '@nestjsx/crud';
import { MediaImagesEntity } from 'src/entities/media_images.entity';

@Crud({ model: { type: MediaImagesEntity } })
@Controller('media-images')
export class MediaImagesController {
  constructor(public service: MediaImagesService) {}
}
