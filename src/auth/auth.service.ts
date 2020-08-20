/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getConnection, getRepository, QueryRunner } from 'typeorm';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { UserRoleEntity } from 'src/entities/user_role.entity';
import { AppService } from 'src/app/app.service';
import { LoginGuardEntity } from 'src/entities/login_guard.entity';
import { LoginActivityEntity } from 'src/entities/login_activity.entity';
import { LoginLockEntity } from 'src/entities/login_lock.entity';
import { LoginConstantEntity } from 'src/entities/login_constant.entity';
import { ILoginConstant } from 'src/interfaces/login_constant.interface';
import { ILoginLock } from 'src/interfaces/login_lock.interface';
import { ILoginGuard } from 'src/interfaces/login_guard.interface';

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

  async validateUser(userId: string, passwordPlanText: string): Promise<any> {
    // เวลาที่ทำรายการ
    const time_now = new Date();
    let time_end_lock: Date;

    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      //ค้นหา user ว่ามีการล็อคอยู่ไหม
      const findLoginGuard =
        (await runner.manager.find(LoginGuardEntity, { where: { userId }, take: 1 }))[0] || ({} as ILoginGuard);
      if (findLoginGuard.login_lock_id) {
        // หา login_lock.id = login_lock_id
        const findLoginLock = ((await runner.manager.findOne(LoginLockEntity, findLoginGuard.login_lock_id)) ||
          {}) as ILoginLock;
        // // ถ้าเวลาปัจจุบันอยู่ระหว่าง time_begin และ time_end แสดงว่าล็อคอยู่
        const { time_begin, time_end } = findLoginLock;
        const isLocked = time_begin <= time_now && (!time_end || time_now <= time_end);
        if (isLocked) {
          throw new UnauthorizedException('Unauthorized : User Locked , กรุณาติดต่อผู้ดูแลระบบ');
        }
        time_end_lock = time_end;
      }
      //> User ไม่ได้ถุกล็อค > ตรวจสอบรหัสผ่าน

      //ค้าหา user จาก db
      const user = await this.usersService.findOne(userId);

      // หารหัสผ่านที่เข้ารหัสอยู่( อ่านค่ามาจาก db )
      const passwordEncrypt: string = user.Secrets;

      // เอาค่า passwordEncrypt มาถอดรหัส
      const passwordDecrypt = await axios
        .post(`${process.env.API_DECRYPT}`, {
          text: passwordEncrypt.trim(),
          key: 'UW',
        })
        .then((response) => {
          if (response.data) return response.data;
          throw new NotFoundException(`Not found ,response.data`);
        })
        .catch((err) => {
          console.error(err);
          throw new InternalServerErrorException(`Error : Cannot Descrypt password , ${err}`);
        });

      // ตรวจสอบรหัสผ่าน
      const isSuccess = passwordDecrypt === passwordPlanText;

      // เก็บ login_activity
      const saveLoginActivity = await runner.manager.save(LoginActivityEntity, {
        user_id: userId,
        login_success: isSuccess ? '1' : '0',
        login_time: time_now,
      } as LoginActivityEntity);

      // ถ้าล็อคอินสำเร็จ ให้คืนค่าที่ได้
      if (isSuccess) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Secrets, ...result } = user;
        return result;
      }

      //> ล็อคอินไม่สำเร็จ > ให้นับว่าไม่สำเร็จครบเงื่อนไข เพื่อจะ Lock หรือไม่
      // หา login_constant
      const { failure_count, failure_intime, lock_time_period } =
        (
          await runner.manager.find(LoginConstantEntity, {
            take: 1,
          })
        )[0] || ({} as ILoginConstant);

      // มีการกำหนดเงื่อนไขการ Lock User
      if (failure_count > 0 && failure_intime > 0 /*&& lock_time_period > 0*/) {
        // หา login_activity ที่ผ่านมา
        let findLoginActivity = await runner.manager.find(LoginActivityEntity, {
          where: { user_id: userId },
          order: { login_time: 'DESC' },
          take: failure_count,
        });

        // ถ้ามีเวลาที่ล็อคล่าสุด ให้มองต่อจากเวลานี้
        if (time_end_lock) {
          findLoginActivity = findLoginActivity.filter((item) => item.login_time > time_end_lock);
        }

        if (findLoginActivity.length === failure_count) {
          // หาว่ามีรายการที่ success มั้ย ถ้ามีแสดงว่าไม่ต้อง Lock
          const findLoginActivitySuccess = findLoginActivity.find((item) => item.login_success === '1');
          if (!findLoginActivitySuccess) {
            //> เป็นรายการ failure ท้ังหมด
            // หาเวลา login_time_first , login_time_last
            const login_time_first = findLoginActivity[0].login_time;
            const login_time_last = findLoginActivity[findLoginActivity.length - 1].login_time;
            const diffTime = this.appService.diffTime(login_time_first, login_time_last);
            if (diffTime.diffMinutes <= failure_intime) {
              //> ใส่รหัสผ่านผิดภายในเวลาที่กำหนด = Lock
              // คำนวณระยะเวลาที่ user จะถูกล็อค
              let time_lock: Date = null;
              if (lock_time_period > 0) {
                time_lock = new Date(time_now);
                time_lock.setMinutes(time_lock.getMinutes() + lock_time_period);
              } else {
                // time_lock = null คือล็อคตลอดชาติ (ให้ติดต่อ Admin ปลดล็อคให้)
              }

              // บันทึกลง table : login_lock
              const saveLoginLock = await runner.manager.save(LoginLockEntity, {
                user_id: userId,
                time_begin: time_now,
                time_end: time_lock,
                login_activity_id: saveLoginActivity.id,
              } as LoginLockEntity);

              // เอา id จาก login_lock ไประบุที่ login_guard.login_lock_id
              findLoginGuard.user_id = userId;
              findLoginGuard.login_lock_id = saveLoginLock.id;
              await runner.manager.save(LoginGuardEntity, findLoginGuard);
            }
          }
        }
      }

      // ล็อคอินไม่สำเร็จ
      return null;
    });
  }

  // ผ่านการ validateUser แล้ว (ล็อคอินสำเร็จแล้ว)
  async loginSuccessed(user: any) {
    //
    const { EmployeeId: userId, Fullname: userName, EmployeeLevel: employeeLevel } = user;

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
    const payload = { userId, userName, uuid, employeeLevel } as IUser;

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
