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

                if (obj.length > 1 && number < obj.length) {
                    console.log('num' + number)
                    //วันของรายการถัดไป
                    let dateplus = obj[number].effect_date
                    console.log('วันของรายการถัดไป :' + dateplus)
                    //นำวันถัดไปมาลบกับวันที่จะหาผลลัพธ์ เพิ่ที่จะได้ค่าระหว่างวันที่จะต้องจ่าย
                    //const sumday = dateplus.effect_date.getDate() - entry.effect_date.getDate();
                    const startdate = dateplus;
                    let todate = new Date(entry.effect_date);
                    const diffTime = Math.abs(startdate.getTime() - todate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log('diffday :' + diffDays)


                    //หาวันจาก datefrom เพื่อให้ได้วันที่คิดใน percen แรกที่ถูกต้อง
                    let dayDate_fr;
                    if (obj[0].effect_date) {
                        let date_fr = new Date(props.date_fr);
                        let todate = new Date(entry.effect_date);
                        const diffTime = Math.abs(date_fr.getTime() - todate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        console.log('วันที่ที่ได้ sumday by Date_fr:' + diffDays);
                        dayDate_fr = diffDays
                    }
                    console.log('diffday + diff_dayDate_fr :' + (Math.floor(diffDays + dayDate_fr)))
                    const sumday = Math.floor(diffDays + dayDate_fr);
                    console.log('นำวันถัดไปมาลบกับวันที่จะหาผลลัพธ์ เพิ่อที่จะได้ค่าระหว่างวันที่จะต้องจ่าย :' + sumday)
                    const interest = ((Math.floor(sumday + 1)) * entry.percent / 100) * props.princ;
                    console.log('percen :' + entry.percent)
                    console.log('x1:' + interest)
                    sumXinterest.push(interest)
                    // var start = new Date(props.date_fr);
                    // console.log('วันสุดท้ายของเดือน :' + start)

                    // //หาปี
                    // var y = start.getFullYear();
                    // console.log('ปี :' + y)
                    // //หาเดือน
                    // var m = (start.getMonth() + 1);
                    // console.log('เดือน :' + m)

                    // //หาวันสุดท้ายของเดือน
                    // let sumday = ((new Date(y, m, 0)).getDate() - new Date(props.date_fr).getDate());
                    // console.log('วันที่ที่ได้' + new Date(y, m, 0).getDate());

                    // const interest = ((Math.floor(sumday + 1)) * entry.percent / 100) * props.princ;
                    // console.log('date fr :' + new Date(props.date_fr).getDate())
                    // console.log('sumday :' + Math.floor(sumday + 1))
                    // console.log('percen :' + entry.percent)
                    // console.log('x1:' + interest)
                    // sumXinterest.push(interest)
                    //suminterest += interest
                } else if (obj.length > 1 && number == obj.length) {
                    //todate = new Date(entry.effect_date);
                    let dateplus;
                    var endDate = new Date(entry.effect_date);
                    console.log('วันสุดท้ายของเดือน :' + endDate)

                    //หาปี
                    var y = endDate.getFullYear();
                    console.log('ปี :' + y)
                    //หาเดือน
                    var m = (endDate.getMonth() + 1);
                    console.log('เดือน :' + m)

                    //หาวันสุดท้ายของเดือน
                    let sumday = ((new Date(y, m, 0)).getDate() - new Date(props.date_to).getDate());
                    console.log('วันที่ที่ได้' + new Date(y, m, 0).getDate());
                    console.log('วันที่ที่ได้ sumday :' + sumday);

                    const interest = ((Math.floor(sumday + 1)) * entry.percent / 100) * props.princ;
                    console.log('percen :' + entry.percent)
                    console.log('x' + number + ' :' + interest)
                    sumXinterest.push(interest)
                }
                //รอบต่อไปจะใช้ date_to เป็นตัวหาจำนวนวัน
                else {

                    console.log('num' + number)
                    //วันของรายการถัดไป
                    const dateplus = obj[number].effect_date
                    console.log('วันของรายการถัดไป :' + dateplus)
                    //นำวันถัดไปมาลบกับวันที่จะหาผลลัพธ์ เพิ่ที่จะได้ค่าระหว่างวันที่จะต้องจ่าย
                    //const sumday = dateplus.effect_date.getDate() - entry.effect_date.getDate();
                    const startdate = dateplus;
                    const todate = new Date(entry.effect_date);
                    const diffTime = Math.abs(startdate.getTime() - todate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    console.log('diffday :' + diffDays)
                    const sumday = diffDays;
                    console.log('นำวันถัดไปมาลบกับวันที่จะหาผลลัพธ์ เพิ่ที่จะได้ค่าระหว่างวันที่จะต้องจ่าย :' + sumday)
                    const interest = ((Math.floor(sumday + 1)) * entry.percent / 100) * props.princ;
                    console.log('percen :' + entry.percent)
                    console.log('x' + number + ' :' + interest)
                    sumXinterest.push(interest)

                    //     const sumday = ((new Date(props.date_to).getDate()));
                    //     const interest = ((sumday) * entry.percent / 100) * props.princ;
                    //     console.log('date to :' + new Date(props.date_to).getDate())
                    //     console.log('sumday :' + (sumday))
                    //     console.log('percen :' + entry.percent)
                    //     console.log('x2:' + interest)
                    //     sumXinterest.push(interest)
                    //     //suminterest += interest
                }
            }
            console.log('โชว์ค่าที่เก็บใน array :' + sumXinterest)
            //console.log('โชว์ค่ารวม :' + suminterest)
            console.log('โชว์ผลรวมของ 2 ค่า :' + sumXinterest.reduce(function (a, b) { return a + b; }, 0))
            //const Ckecksumday = ((new Date(props.date_to).getDate() - new Date(props.date_fr).getDate()));

            const Result = sumXinterest.reduce(function (a, b) { return a + b; }, 0);

            //return InterstRate
            return { Result }
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
