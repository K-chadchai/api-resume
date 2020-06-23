import { Controller, Post, Body } from '@nestjs/common';
import { MediaSaleDepartmentService } from './media-sale-department.service';

@Controller('media-sale-department')
export class MediaSaleDepartmentController {
    constructor(public service: MediaSaleDepartmentService) { }

    @Post()
    async post(@Body() body) {
        return this.service.post(body);
    }
}