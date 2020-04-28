import { Injectable } from '@nestjs/common';
import { TUsersInterface } from './users.entity';
import { _MongoTables } from 'src/app.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(_MongoTables.users)
    private tUsersModel: Model<TUsersInterface>,
  ) {}

  // Create
  async createUser(value, session) {
    //
    const tUsersModel = new this.tUsersModel(value);
    const created = await tUsersModel.save({ session });
    return created;
  }

  // Qeury
  async getUsers(value) {
    const { employeeId, name } = value;
    const query =
      employeeId || name ? { $or: [{ employeeId }, { name }] } : null;
    const data = await this.tUsersModel.find(query).exec();
    return data.map(({ employeeId, name }) => ({ employeeId, name }));
    // return data;
  }

  // Update
  async updateUser(value, session) {
    const { employeeId, ...updateValue } = value;
    const updatedDoc = await this.tUsersModel.findOneAndUpdate(
      { employeeId },
      { ...updateValue },
      {
        new: true, // true: คืนค่าใหม่ที่อัพเดท
        omitUndefined: true, // true: ไม่อัพเดทคอลัมล์ที่เป็น undefined
        session,
      },
    );
    if (!updatedDoc) throw new RpcException(`Not found update data`);
    return updatedDoc;
  }

  // Delete
  async deleteUser(value, session) {
    const { employeeId } = value;
    const { deletedCount } = await this.tUsersModel.deleteOne(
      { employeeId },
      { session },
    );
    if (!deletedCount) throw new RpcException(`Not found delete data`);
  }
}
