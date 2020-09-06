import { Controller, Post, Body } from '@nestjs/common';
import { MediaSaleDepartmentService } from './media-sale-department.service';
import { Crud } from '@nestjsx/crud';
import { MediaSaleDepartmentEntity } from 'src/entities/media_sale_department.entity';

@Crud({
  model: { type: MediaSaleDepartmentEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-sale-department')
export class MediaSaleDepartmentController {
  constructor(public service: MediaSaleDepartmentService) {}
}
