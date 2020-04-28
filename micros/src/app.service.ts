import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter,
  Logger,
  Injectable,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { Connection as ConnectionMongoose, ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection as ConnectionTypeOrm, QueryRunner } from 'typeorm';

@Catch(RpcException)
export class AppExceptions implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(exception.getError());
  }
}

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private connMongoose: ConnectionMongoose,
    private connTypeOrm: ConnectionTypeOrm,
  ) {}

  // Postgres Session
  async postgresRunner(onCallback: Function) {
    try {
      let runner: QueryRunner;
      // Create transaction
      try {
        runner = this.connTypeOrm.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
      } catch (error) {
        Logger.error(error);
        throw new RpcException(
          `Postgres transaction couldn\'t create : ${
            error.errmsg || error.message
          }`,
        );
      }
      // Call service
      let returnValue: any;
      try {
        returnValue = await onCallback(runner);
        await runner.commitTransaction();
      } catch (error) {
        await runner.rollbackTransaction();
        throw new RpcException(error.errmsg || error.message);
      } finally {
        await runner.release();
      }
      return returnValue;
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }

  // Mongo Session
  async mongoSession(onCallback: Function) {
    try {
      let session: ClientSession;
      // Create transaction
      try {
        session = await this.connMongoose.startSession();
        session.startTransaction();
      } catch (error) {
        Logger.error(error);
        throw new RpcException(
          `Mongo transaction couldn\'t create : ${
            error.errmsg || error.message
          }`,
        );
      }
      // Call service
      let returnValue: any;
      try {
        returnValue = await onCallback(session);
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        Logger.error(error);
        throw new RpcException(error.errmsg || error.message);
      } finally {
        session.endSession();
      }
      return returnValue;
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
}
