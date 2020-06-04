import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InterstRateEntity } from 'src/entities/interst_rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from "typeorm";
import { parse } from 'querystring';



interface ICalcInt {
    date_fr: Date,
    date_to: Date,
    princ: number
}

@Injectable()
export class InterstRateService extends TypeOrmCrudService<InterstRateEntity> {
    constructor(@InjectRepository(InterstRateEntity) repo) {
        super(repo)
    }

    async calcInt(props: ICalcInt) {

        // Validate 
        if (!props.date_fr || !props.date_to || !props.princ) {
            this.throwBadRequestException('กรุณาตรวจสอบ วันที่เริ่มต้น,วันที่สิ้นสุด,จำนวนเงิน')
        }

        // Process
        const InterstRate = await this.repo.find({
            select: ["percent"],
            where: {
                effect_date: Between(new Date(props.date_fr), new Date(props.date_to))
            }
        }
        );
        if (InterstRate.length > 1) {
            console.log("มากกว่า 1")
            console.log(InterstRate.length)
            return ""
        } else {
            let obj: InterstRateEntity = InterstRate[0];
            console.log(obj.percent);
            const sumday = ((new Date(props.date_to).getDate() - new Date(props.date_fr).getDate()));
            const interest = (sumday * obj.percent / 100) * props.princ;
            return { interest }
        }
        // Return
        return ""
    }
}
