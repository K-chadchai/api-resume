import { Logger, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Connection as ConnectionTypeOrm, QueryRunner } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private connTypeOrm: ConnectionTypeOrm) {}

  // Postgres Session
  async dbRunner(onCallback: Function) {
    let runner: QueryRunner;
    // Create transaction
    try {
      runner = this.connTypeOrm.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(
        `Postgres transaction couldn\'t create : ${error.errmsg || error.message}`,
      );
    }
    // Call service
    let returnValue: any;
    try {
      returnValue = await onCallback(runner);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw new InternalServerErrorException(`Transaction Error,${error.errmsg || error.message}`);
    } finally {
      await runner.release();
    }
    return returnValue;
  }

  // คำนวณเวลาส่วนต่าง
  diffTime(dateFr: Date, dateTo: Date) {
    const msConstant = {
      perDay: 86400000,
      perHour: 3600000,
      perMin: 60000,
      perSec: 1000,
    };
    const diffMs = dateTo.getTime() - dateFr.getTime(); // milliseconds between dateFr & dateTo
    // console.log('diffMs :>> ', diffMs);
    const diffDays = Math.floor(diffMs / msConstant.perDay); // days : 1 day = 86400000 milliseconds
    const diffHours = Math.floor((diffMs % msConstant.perDay) / msConstant.perHour); // hours : 1 hr = 3600000 milliseconds
    const diffMinutes = Math.floor(((diffMs % msConstant.perDay) % msConstant.perHour) / msConstant.perMin); // minutes : 1 min = 60000 milliseconds
    const diffSeconds = Math.floor(
      (((diffMs % msConstant.perDay) % msConstant.perHour) % msConstant.perMin) / msConstant.perSec,
    ); // seconds : 1 sec = 1000  milliseconds
    const remainMilliseconds =
      diffMs -
      diffDays * msConstant.perDay -
      diffHours * msConstant.perHour -
      diffMinutes * msConstant.perMin -
      diffSeconds * msConstant.perSec;
    return { msConstant, diffDays, diffHours, diffMinutes, diffSeconds, remainMilliseconds };
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
