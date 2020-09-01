/* eslint-disable @typescript-eslint/camelcase */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, QueryRunner } from 'typeorm';
import axios from 'axios';
import { AppService } from 'src/app/app.service';
import { LoginGuardEntity } from 'src/entities/login_guard.entity';
import { LoginActivityEntity } from 'src/entities/login_activity.entity';
import { LoginLockEntity } from 'src/entities/login_lock.entity';
import { LoginConstantEntity } from 'src/entities/login_constant.entity';
import { RoleActivityEntity } from 'src/entities/role_activity.entity';
import { DBAUTHOR } from 'src/app/app.constants';
import { Utility } from '@nikom.san/api-common';
import { ILoginLock, JwtConstant, ILoginConstant, ILoginGuard, IRoleActivity, RAuthUserRoles, TokenDto } from '@libs';

interface IUserRole {
  RoleCode: string;
  ActionCode: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConnection(DBAUTHOR) private connection: Connection,
    private appService: AppService,
  ) {}

  async localValidate(userId: string, passwordPlanText: string) {
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

        // ถ้าเวลาปัจจุบันอยู่ระหว่าง time_begin และ time_end แสดงว่าล็อคอยู่
        const { time_begin, time_end } = findLoginLock;
        const isLocked = time_begin <= time_now && (!time_end || time_now <= time_end);
        if (isLocked) {
          throw new UnauthorizedException('รหัสผู้ใช้ถูกระงับการใช้งาน, กรุณาติดต่อผู้ดูแลระบบ');
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
      const time_expire = new Date(time_now);
      time_expire.setSeconds(time_expire.getSeconds() + JwtConstant.TIMEOUT);
      const saveLoginActivity = await runner.manager.save(LoginActivityEntity, {
        user_id: userId,
        login_success: isSuccess ? '1' : '0',
        login_time: time_now,
        time_expire,
      } as LoginActivityEntity);

      // ถ้าล็อคอินสำเร็จ ให้คืนค่าที่ได้
      if (isSuccess) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { Secrets, ...result } = user;
        return { ...result, LoginActivityId: saveLoginActivity.id };
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
            const diffTime = Utility.diffTimes(login_time_first, login_time_last);
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
      return;
    });
  }

  // ผ่านการ validateUser แล้ว (ล็อคอินสำเร็จแล้ว)
  async loginLocal(user: any) {
    //
    const { EmployeeId: userId, Fullname: userName, EmployeeLevel: employeeLevel, LoginActivityId: uuid } = user;

    // Create payload
    const payload = { userId, userName, uuid, employeeLevel } as TokenDto;

    // Create token JWT
    const token = this.jwtService.sign(payload);

    // แปลงเป็น JWT
    return { token };
  }

  // ตรวจสอบ Token
  async loginToken(user: TokenDto) {
    const { uuid } = user;
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const findLoginActivity = await runner.manager.findOne(LoginActivityEntity, uuid);
      if (findLoginActivity.login_success !== '1') {
        throw new BadRequestException(`รายการ login_activity.id=${uuid} ,login_success !== '1'`);
      }
      if (findLoginActivity.logout_status === '1') {
        throw new BadRequestException(`รายการ login_activity.id=${uuid} ,logout_status === '1'`);
      }
      if (findLoginActivity.kill_status === '1') {
        throw new BadRequestException(`รายการ login_activity.id=${uuid} ,kill_status === '1'`);
      }
      return user;
    });
  }

  async logout({ uuid, actionTime }: TokenDto) {
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      //
      const findLoginActivity = await runner.manager.findOne(LoginActivityEntity, uuid);
      if (!findLoginActivity) {
        return {}; // throw new NotFoundException(`ไม่พบ login_activity.id=${uuid}`);
      }
      // if (findLoginActivity.login_success !== '1') {
      //   throw new BadRequestException(`รายการ login_activity.id=${uuid} ,login_success !== '1' ,ไม่สามารถ logout ได้`);
      // }
      // if (findLoginActivity.logout_status === '1') {
      //   throw new BadRequestException(`รายการ login_activity.id=${uuid} ,logout_status === '1' ,ไม่สามารถ logout ได้`);
      // }
      // if (findLoginActivity.kill_status === '1') {
      //   throw new BadRequestException(`รายการ login_activity.id=${uuid} ,kill_status === '1' ,ไม่สามารถ logout ได้`);
      // }

      // Update
      findLoginActivity.logout_status = '1';
      findLoginActivity.logout_time = actionTime;
      await runner.manager.save(LoginActivityEntity, findLoginActivity);
      return { uuid, logout_time: actionTime };
    });
  }

  // เมื่อต้องการ kill jwt
  async killUser(userAdmin: string, userKill: string) {
    //
    if (!userAdmin) throw new BadRequestException('Invalid : userAdmin');
    if (!userKill) throw new BadRequestException('Invalid : userKill');
    // หารายการที่ login สำเร็จและยังไม่หมดอายุ
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      //
      const rc: any[] = await runner.manager.query(`
      update login_activity 
      set kill_status = '1' ,
        kill_admin = '${userAdmin}',
        kill_time = now()
      where user_id = '${userKill}'
      and login_success = '1'
      and now() < time_expire 
      and (kill_status is null or kill_status = '0')`);
      const rowsEffect = rc[1];
      if (rowsEffect !== 1) {
        throw new InternalServerErrorException(`Update kill : ต้องมีแค่ 1 รายการเท่านั้น ,rowsEffect=${rowsEffect}`);
      }
      return { rowsEffect };
    });
  }

  async jwtValidate(token: TokenDto) {
    // ตรวจสอบว่า uuid( login_activity.id ) ถูก kill ไปแล้วหรือยัง
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      // Step - ตรวจสอบค่า uuid
      const { kill_status, id: login_activity_id_tpm } =
        (await runner.manager.findOne(LoginActivityEntity, token.uuid)) || {};
      if (kill_status === '1') {
        throw new UnauthorizedException(`Token was killed `);
      }
      if (!login_activity_id_tpm) {
        throw new UnauthorizedException(`Not found uuid=${token.uuid}`);
      }

      // return req.user
      const { userId, userName, uuid, employeeLevel } = token;
      return { userId, userName, uuid, employeeLevel, actionTime: new Date() };
    });
  }

  async getUserRoles(moduleId: string, token: TokenDto): Promise<RAuthUserRoles> {
    // ตรวจสอบ moduleId
    if (!moduleId) {
      throw new BadRequestException(`ไม่พบค่า moduleId, กรุณาตรวจสอบ`);
    }
    // ตรวจสอบว่า uuid( login_activity.id ) ถูก kill ไปแล้วหรือยัง
    return this.appService.dbRunner(async (runner: QueryRunner) => {
      // 1 - ตรวจสอบค่า uuid >> ทำแล้วที่ jwt.strategy>validate
      // 2 - เอา uuid ไปเช็คว่าใน DynamoDB มีค่า role หรือป่าว
      const findRoleActivity = await runner.manager.findOne(RoleActivityEntity, token.uuid);

      // 2.1 > ถ้าพบค่า role ให้คืน role เลย
      if (findRoleActivity && findRoleActivity.id) {
        return { ...JSON.parse(findRoleActivity.roles_json) };
      }

      // 2.2 > ถ้าไม่พบค่า role ให้ไปอ่านจาก mssql
      // 3(2.2) หาค่า role จาก mssql
      const userRoles: IUserRole[] = await this.connection.query(`
      SELECT R.Reference AS RoleCode, PA.ActionCode
      FROM  [dbo].[Policy_Actions]  PA ,
          [dbo].[Actions] A,
          [dbo].[Roles] R
      WHERE PA.ActionCode = A.ActionCode
      AND PA.RoleId = R.RoleId
      AND PA.ProgramKey = '${moduleId}'
      AND PA.[Status] = '1'
      AND EXISTS (
          SELECT NULL FROM Employees_Roles
          WHERE Employees_Roles.Employees_EmployeeId = '1036349'
          AND Employees_Roles.Roles_RoleId = PA.RoleId
      )
      GROUP BY R.Reference, PA.ActionCode
      ORDER BY R.Reference, PA.ActionCode`);

      /* เปลี่ยนให้เป็น json
        ['action1','action2'] 
      */
      const actionsCode: string[] = []; // ['action1','action2']
      const rolesCode: string[] = []; // ['BA','SA']
      const rolesActoins: any = {}; // {'BA':['Action1','Action2'],'SA':['Action3']}
      userRoles.forEach((item) => {
        if (!rolesCode.includes(item.RoleCode)) {
          rolesCode.push(item.RoleCode);
          rolesActoins[item.RoleCode] = [item.ActionCode];
        } else {
          const actions: string[] = [...rolesActoins[item.RoleCode]];
          if (!actions.includes(item.ActionCode)) {
            actions.push(item.ActionCode);
          }
          rolesActoins[item.RoleCode] = [...actions];
        }
        if (!actionsCode.includes(item.ActionCode)) {
          actionsCode.push(item.ActionCode);
        }
      });

      // 3.1 พบค่า role เอาค่า role ไปบันทึกที่ DynamoDB
      const userRolesValues = { rolesActoins, rolesCode, actionsCode };
      await runner.manager.save(RoleActivityEntity, {
        id: token.uuid,
        user_id: token.userId,
        roles_json: JSON.stringify(userRolesValues),
      } as IRoleActivity);

      return userRolesValues;
    });
  }
}
