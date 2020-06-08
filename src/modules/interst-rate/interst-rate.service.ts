import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InterstRateEntity } from 'src/entities/interst_rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from "typeorm";

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

        console.log(props.date_fr + ' ' + props.date_to)
        const InterstRate = await this.repo.find({
            where: {
                effect_date: Between(new Date(props.date_fr), new Date(props.date_to))
            },
            order: {
                effect_date: "ASC"
            }
        }
        );

        console.log("ข้อมูลที่ได้จากการค้นหา :" + InterstRate);

        if (InterstRate.length > 1) {
            console.log("มากกว่า 1")
            console.log(InterstRate)
            const obj: InterstRateEntity[] = InterstRate;
            let number: number = 0;
            //var suminterest;
            var sumXinterest = new Array();

            for (let entry of obj) {
                number++;
                console.log(entry); // 1, "string", false
                console.log('จำนวนรอบ :' + number); // 1, "string", false
                const d = ((new Date(props.date_fr).getDate()));
                // console.log('วันที่ ก่อนเปลี่ยนวัน' + new Date(props.date_to).getDate());
                //console.log('เช็ควันที่  :' + (30 - d));
                //รอบแรกจะใช้ date_fr เป็นตัวตั้งหาจำนวนวัน
                if (number == 1) {
                    console.log('num1')
                    const sumday = ((31 - new Date(props.date_fr).getDate()));
                    const interest = ((Math.floor(sumday + 1)) * entry.percent / 100) * props.princ;
                    console.log('date fr :' + new Date(props.date_fr).getDate())
                    console.log('sumday :' + Math.floor(sumday + 1))
                    console.log('percen :' + entry.percent)
                    console.log('x1:' + interest)
                    sumXinterest.push(interest)
                    //suminterest += interest
                }
                //รอบต่อไปจะใช้ date_to เป็นตัวหาจำนวนวัน
                else {
                    const sumday = ((new Date(props.date_to).getDate()));
                    const interest = ((sumday) * entry.percent / 100) * props.princ;
                    console.log('date to :' + new Date(props.date_to).getDate())
                    console.log('sumday :' + (sumday))
                    console.log('percen :' + entry.percent)
                    console.log('x2:' + interest)
                    sumXinterest.push(interest)
                    //suminterest += interest
                }
            }
            console.log('โชว์ค่าที่เก็บใน array :' + sumXinterest)
            //console.log('โชว์ค่ารวม :' + suminterest)
            console.log('โชว์ผลรวมของ 2 ค่า :' + sumXinterest.reduce(function (a, b) { return a + b; }, 0))
            //const Ckecksumday = ((new Date(props.date_to).getDate() - new Date(props.date_fr).getDate()));

            return InterstRate
        } else {
            let obj: InterstRateEntity = InterstRate[0];
            console.log(obj);
            const sumday = ((new Date(props.date_to).getDate() - new Date(props.date_fr).getDate()));
            const interest = ((sumday + 1) * obj.percent / 100) * props.princ;
            return { interest }
        }
        // Return
        return ""
    }
}
