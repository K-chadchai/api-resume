/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getConnection, getRepository, QueryRunner } from 'typeorm';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UserRoleEntity } from 'src/entities/user_role.entity';
import { AppService } from 'src/app/app.service';
import { async } from 'rxjs/internal/scheduler/async';
import { LoginGuardEntity } from 'src/entities/login_guard.entity';
import { LoginActivityEntity } from 'src/entities/login_activity.entity';

interface IGetPayload {
  username: string;
  password: string;
}

interface IUser {
  userId: string;
  userName: string;
  uuid: string;
}

interface IUserRole {
  Reference: string;
  ActionCode: string;
  Status: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConnection('mssql')
    private readonly connection: Connection,
    private appService: AppService,
  ) {}

  async validateUser(username: string, passwordPlanText: string): Promise<any> {
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      //ค้นหา user ว่ามีการล็อคอยู่ไหม

      const fineUserlock = await getConnection()
        .getRepository(LoginGuardEntity)
        .createQueryBuilder('login_guard')
        .where(`login_guard.user_id = '${username}'`)
        .getOne();

      if (fineUserlock === undefined) {
        //ถ้าไม่มีให้ไปเช็ค LoginActivity ว่ามีการ loging ติดต่อกันภายในช่วงเวลาติดต่อกันตามที่กำหนดหรือไม่
        const fineUserActivity = await getConnection()
          .getRepository(LoginActivityEntity)
          .createQueryBuilder('login_activity')
          .where(`login_activity.user_id = '${username}' and login_activity.login_success = 0`)
          .getOne();
        if (fineUserActivity !== undefined) {
          //ถ้ามี LoginActivity ว่ามีการ loging ติดต่อกันภายในช่วงเวลาติดต่อกันตามที่กำหนดหรือไม่
          const fineUserActivity = await getConnection()
            .getRepository(LoginActivityEntity)
            .createQueryBuilder('login_activity')
            .where(`login_activity.user_id = '${username}' and login_activity.login_success = 0`);
        } else {
          // return await this.appService.dbRunner(async (runner: QueryRunner) => {
          //   const loginActivityEntity = new LoginActivityEntity();
          //   loginActivityEntity.user_id = username;
          //   loginActivityEntity.login_time = new Date();
          //   loginActivityEntity.login_success = '';
          //   const sloginActivity_object = await runner.manager.save(
          //     LoginActivityEntity,
          //     loginActivityEntity,
          //   );
          //   const { id } = sloginActivity_object;
          //   if (id !== undefined) {
          //     return {};
          //   }
          // });
        }
      } else {
        return null;
      }
      /////////////////////////////////////////////////----Process เดิม--------///////////////////////////////////////////////////////////
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
      } else {
        return null;
      }
    });
    //return null;
  }

  async login(user: any) {
    //
    const { EmployeeId: userId, Fullname: userName, ...rest } = user;

    // return this.appService.dbRunner((runner: QueryRunner) => {
    //   // ส่ง rest ไปบันทึกที่ DynamoDB แล้วก็จะได้ค่า uuid (id) คืนมา
    //   // const toKenEntity = new SingleSignOnTokenEntity();
    //   // toKenEntity.action_user = userId;
    //   // runner.manager.save(SingleSignOnTokenEntity, toKenEntity);
    //   return null;
    // });

    // const { id } = await repositoryToken.save(toKenEntity);
    const uuid = uuidv4();

    // Create payload
    const payload = { userId, userName, uuid: uuid } as IUser;

    return {
      token: this.jwtService.sign(payload),
    };
  }

  // หา role ของ user
  async userRole(user: IUser, apiProgram: string) {
    const { uuid } = user || {};

    // 1 - ตรวจสอบค่า uuid
    if (!uuid) {
      throw new NotFoundException('ไม่พบข้อมูล uuid');
    }

    // 2 - เอา uuid ไปเช็คว่าใน DynamoDB มีค่า role หรือป่าว
    //const isFoundRoleByUuid = false;
    // 2.1 > ถ้าพบค่า role ให้คืน role เลย
    const isFoundRoleByUuid: any = await this.getRolebyId(user.uuid);
    console.log('isFoundRoleByUuid ===>>>>>>', isFoundRoleByUuid);
    if (isFoundRoleByUuid !== undefined) {
      const role = JSON.stringify(isFoundRoleByUuid);
      console.log('isFoundRoleByUuidstringify ====>>>', role);
      return isFoundRoleByUuid;
    }

    // 2.2 > ถ้าไม่พบค่า role ให้ไปอ่านจาก mssql
    // 3(2.2) หาค่า role จาก mssql
    const queryFindRole = `select rl.Reference,
    ac.ActionCode
from Policy_Actions ac ,
    Roles rl 
where ac.RoleId  =  rl.RoleId
--
and ac.ProgramKey  =  '${apiProgram}'
and ac.[Status]  =  1 
and exists (
    select null 
    from Employees_Roles er 
    where er.Employees_EmployeeId  =  '${user.userId}'
    and rl.RoleId  =  er.Roles_RoleId
)
group by rl.Reference,
    ac.ActionCode
order by rl.Reference,
    ac.ActionCode`;

    const userRoles: IUserRole[] = await this.connection.query(queryFindRole);
    if (!userRoles || userRoles.length == 0) {
      return {};
    }
    // แปลง userRoles เป็น json ในรูปแบบ
    // {
    //   “BA”:[“aa”,”bb”],
    //   “PG”:[“aa”,”bb”]
    //   }
    // console.log('userRoles :>> ', userRoles);
    const jsonRoles: any = {};
    userRoles.forEach((item) => {
      const roleName = item['Reference'];
      const actionCode = item['ActionCode'];
      if (jsonRoles[roleName]) {
        jsonRoles[roleName] = [...jsonRoles[roleName], actionCode];
      } else {
        jsonRoles[roleName] = [actionCode];
      }
    });
    console.log('jsonRoles :>> ', jsonRoles);

    // 3.1 พบค่า role เอาค่า role ไปบันทึกที่ DynamoDB
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const userRoleEntity = new UserRoleEntity();
      userRoleEntity.reference = user.uuid;
      userRoleEntity.app = apiProgram;
      userRoleEntity.role = jsonRoles;

      const sUserRole_object = await runner.manager.save(UserRoleEntity, userRoleEntity);
      const { id } = sUserRole_object;
      if (id !== undefined) {
        return { role: jsonRoles };
      }
    });

    // 3.2 ไม่พบค่า role เอาค่า role { notfound : true } ไปบันทึกที่ DynamoDB
    // 4(3.1) กรณีพบค่า role จะต้องแปลงข้อมูลเป็น json เพื่อเอาไปบันทึกที่ DynamoDB ได้
    // 4.1 แปลงข้อมูลที่ได้จาก sql เป็น json
    // 4.2 เอา json ไปบันทึกที่ DynamoDB
  }

  async getRolebyId(uuid: string) {
    const fineSaleDepart = await getConnection()
      .getRepository(UserRoleEntity)
      .createQueryBuilder('user_role')
      .select(['user_role.role'])
      .where(`user_role.reference = '${uuid}'`)
      .getOne();

    const role = fineSaleDepart;
    console.log('fineSaleDepart ===>>>>', fineSaleDepart);
    return role;
  }
}
