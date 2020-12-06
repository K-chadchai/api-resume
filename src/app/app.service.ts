import { Logger, Injectable, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ComException } from '@newsolution/api-common';
import { Connection, QueryRunner } from 'typeorm';

// AllExceptionsFilter
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { statusCode, message } = ComException.getError(exception);
    response.status(statusCode).send({ statusCode, message });
  }
}

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
      throw error;
    }
    // Call service
    let returnValue: any;
    try {
      returnValue = await onCallback(runner);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
    return returnValue;
  }
}
