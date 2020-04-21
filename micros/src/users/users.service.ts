import { Injectable } from '@nestjs/common';
import { TUsersInterface } from './users.schema';
import { _MongoTables, _KafkaMessage } from 'src/app.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(_MongoTables.users)
    private tUsersModel: Model<TUsersInterface>,
  ) {}
  //
  async createUser(value, session) {
    const tUsersModel = new this.tUsersModel(value);
    return await tUsersModel.save({ session });
  }
  //
  async getUsersAll(): Promise<TUsersInterface[]> {
    return await this.tUsersModel.find().exec();
  }
  //
  async updateUser(value, session) {
    const { employeeId } = value;
    const rc = await this.tUsersModel.findOneAndUpdate({ employeeId }, value, {
      omitUndefined: true,
    });
    if (!rc) throw new RpcException(`Not found employeeId, ${employeeId}`);
    return rc;
  }
}
