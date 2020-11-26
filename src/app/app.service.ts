import { Logger, Injectable } from '@nestjs/common';
import { ComException } from '@newsolution/api-common';
import { Connection, QueryRunner } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}
  // Postgres Session
  async dbRunner(onCallback: (runner: QueryRunner) => any): Promise<any> {
    let runner: QueryRunner;
    // Create transaction
    try {
      runner = this.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
    } catch (error) {
      Logger.error(error);
      throw new ComException(`Transaction couldn\'t create : ${error.errmsg || error.message}`);
    }
    // Call service
    let returnValue: any;
    try {
      returnValue = await onCallback(runner);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw new ComException(`Transaction Error,${error.errmsg || error.message}`);
    } finally {
      await runner.release();
    }
    return returnValue;
  }
}
