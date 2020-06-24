import { Controller, Post, Body } from '@nestjs/common';
import { MediaUnitService } from './media-unit.service';
import { Crud } from '@nestjsx/crud';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';

@Crud({
    model: { type: MediaUnitEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-unit')
export class MediaUnitController {
    constructor(public service: MediaUnitService) { }
}