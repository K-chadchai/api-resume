import {
  ArgumentsHost,
  Catch,
  RpcExceptionFilter,
  Logger,
  Injectable,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class AppExceptions implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    return throwError(exception.getError());
  }
}

@Injectable()
export class AppService {
  async execute(onCallback: Function) {
    try {
      let session;
      // Create transaction
      try {
        // session = await this.connection.startSession();
        session.startTransaction();
      } catch (error) {
        Logger.error(error);
        throw new RpcException(
          `Transaction couldn\'t create : ${error.errmsg || error.message}`,
        );
      }
      // Call service
      let returnValue;
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
