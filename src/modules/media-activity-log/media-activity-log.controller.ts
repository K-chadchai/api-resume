import { Controller } from '@nestjs/common';
import { MediaActivityLogService } from './media-activity-log.service';

@Controller('media-activity-log')
export class MediaActivityLogController {
    constructor(public service: MediaActivityLogService) { }


}
