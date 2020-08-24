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
}
