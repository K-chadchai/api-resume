import { Controller, Get, Put, Delete, Query, Param, Body, Post } from '@nestjs/common';
import { MediaActivityLogService } from './media-activity-log.service';
import { MediaUserActionEntity } from 'src/entities/media_user_action.entity';
import { Crud } from '@nestjsx/crud';
import { MediaActivityLogEntity } from 'src/entities/media_activity_log.entity';

@Crud({
    model: { type: MediaActivityLogEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('media-activity-log')
export class MediaActivityLogController {
    constructor(public service: MediaActivityLogService) { }

    @Get('/paging')
    async get(@Query() query) {
        return await this.service.getPaging(query)
    }
}
