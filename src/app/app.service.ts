import { Injectable, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
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
    let runner: QueryRunner = undefined;
    try {
      runner = this.connection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      const returnValue = await onCallback(runner);
      await runner.commitTransaction();
      return returnValue;
    } catch (error) {
      if (runner) {
        await runner.rollbackTransaction();
      }
      throw error;
    } finally {
      if (runner) {
        await runner.release();
      }
    }
  }
}
