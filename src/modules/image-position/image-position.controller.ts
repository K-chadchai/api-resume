import { Controller } from '@nestjs/common';
import { ImagePositionService } from './image-position.service';
import { Crud } from '@nestjsx/crud';
import { ImagePostitionEntity } from 'src/entities/image_position.entity';

@Crud({
  model: { type: ImagePostitionEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('image-position')
export class ImagePositionController {
  constructor(public service: ImagePositionService) {}
}
