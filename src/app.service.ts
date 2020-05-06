import {
  Logger,
  Injectable,
  InternalServerErrorException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import {
  Connection as ConnectionTypeOrm,
  QueryRunner,
  QueryFailedError,
} from 'typeorm';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  constructor(private connTypeOrm: ConnectionTypeOrm) {}

  // Postgres Session
  async dbRunner(onCallback: Function) {
    try {
      let runner: QueryRunner;
      // Create transaction
      try {
        runner = this.connTypeOrm.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
      } catch (error) {
        Logger.error(error);
        throw new InternalServerErrorException(
          `Postgres transaction couldn\'t create : ${error.errmsg ||
            error.message}`,
        );
      }
      // Call service
      let returnValue: any;
      try {
        returnValue = await onCallback(runner);
        await runner.commitTransaction();
      } catch (error) {
        await runner.rollbackTransaction();
        throw new InternalServerErrorException(error.errmsg || error.message);
      } finally {
        await runner.release();
      }
      return returnValue;
    } catch (error) {
      throw new InternalServerErrorException(error.errmsg || error.message);
    }
  }
}

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    // const status = exception.message();
    const { message } = exception;
    response.status(500).json({ statusCode: 500, message });
    // response.json({
    //   statusCode: 501,
    //   timestamp: new Date().toISOString(),
    //   path: request.url,
    // });
  }
}
