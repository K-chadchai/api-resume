import { Controller, Get, Param, Query, InternalServerErrorException } from '@nestjs/common';
import { InterstRateEntity } from 'src/entities/interst_rate.entity';
import { Crud } from '@nestjsx/crud';
import { InterstRateService } from './interst-rate.service';


@Crud({
    model: { type: InterstRateEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('interst-rate')
export class InterstRateController {
    constructor(public service: InterstRateService) { }

    @Get('calcint')
    async calcInt(@Query() query) {
        return await this.service.calcInt(query)
    }

}
