import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface IGetPayload {
  username: string;
  password: string;
}

interface IUser {
  userId: string;
  userName: string;
  uuid: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConnection('mssql')
    private readonly connection: Connection,
  ) {}

  async validateUser(username: string, passwordPlanText: string): Promise<any> {
    //ค้าหา user จาก db
    const user = await this.usersService.findOne(username);

    // หารหัสผ่านที่เข้ารหัสอยู่( อ่านค่ามาจาก db )
    const passwordEncrypt: string = user.Secrets;

    // เอาค่า passwordEncrypt มาถอดรหัส
    const passwordDecrypt = await axios
      .post(`${process.env.API_DECRYPT}`, {
        text: passwordEncrypt.trim(),
        key: 'UW',
      })
      .then((response) => {
        if (response.data) {
          return response.data;
        } else {
          throw new InternalServerErrorException('Not found username');
        }
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException('Not found username');
      });

    if (passwordDecrypt === passwordPlanText) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Secrets, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    //
    const { EmployeeId: userId, Fullname: userName, ...rest } = user;

    // ส่ง rest ไปบันทึกที่ DynamoDB แล้วก็จะได้ค่า uuid (id) คืนมา
    const uuid = uuidv4();

    // Create payload
    const payload = { userId, userName, uuid } as IUser;

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // หา role ของ user
  async userRole(user: IUser, body: any) {
    const { uuid } = user || {};

    // 1 - ตรวจสอบค่า uuid
    if (!uuid) {
      throw new NotFoundException('ไม่พบข้อมูล uuid');
    }

    // 2 - เอา uuid ไปเช็คว่าใน DynamoDB มีค่า role หรือป่าว
    // 2.1 > ถ้าพบค่า role ให้คืน role เลย
    // 2.2 > ถ้าไม่พบค่า role ให้ไปอ่านจาก mssql

    // 3(2.2) หาค่า role จาก mssql
    const queryFindRole = `Select
    DISTINCT rl.Reference, ac.ActionCode ,
    Status
  from
    [Policy_Actions] ac
    join [Roles] rl ON ac.RoleId = rl.RoleId
  WHERE
    ProgramKey = '${body.key}'
    AND rl.RoleId IN (
      SELECT
        Roles_RoleId
      FROM
        Employees_Roles
    WHERE
      Employees_EmployeeId = ${user.userId} )`;
    const userRoles = await this.connection.query(queryFindRole);
    console.log('userRoles :>> ', userRoles);
    // 3.1 พบค่า role เอาค่า role ไปบันทึกที่ DynamoDB
    // 3.2 ไม่พบค่า role เอาค่า role { notfound : true } ไปบันทึกที่ DynamoDB

    // 4(3.1) กรณีพบค่า role จะต้องแปลงข้อมูลเป็น json เพื่อเอาไปบันทึกที่ DynamoDB ได้
    // 4.1 แปลงข้อมูลที่ได้จาก sql เป็น json
    // 4.2 เอา json ไปบันทึกที่ DynamoDB
  }
}
