import { Controller } from '@nestjs/common';
import { ImagesService } from './images.service';
import { Crud } from '@nestjsx/crud';
import { ImagesEntity } from 'src/entities/images.entity';

@Crud({
  model: { type: ImagesEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('images')
export class ImagesController {
  constructor(public service: ImagesService) {}
}
