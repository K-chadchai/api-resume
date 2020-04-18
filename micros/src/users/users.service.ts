import { Injectable } from '@nestjs/common';
import { TUsersInterface } from './users.schema';
import { _MongoTables, _KafkaMessage } from 'src/app.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(_MongoTables.users)
    private tUsersModel: Model<TUsersInterface>,
  ) {}
  //
  async createUser(value) {
    // console.log('value:', value);
    const tUsersModel = new this.tUsersModel(value);
    return await tUsersModel.save();
  }
  //
  async getUsersAll(): Promise<TUsersInterface[]> {
    return this.tUsersModel.find().exec();
  }
}
