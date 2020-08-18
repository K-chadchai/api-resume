import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IEmployeeEntity } from 'src/interfaces/employees';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor(
    @InjectConnection('mssql')
    private readonly connection: Connection,
  ) {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    let queryEmployee = `SELECT TOP (1) em.[EmployeeId] as EmployeeId
    ,em.[JobKeyId] as JobKeyId
    --,jk.[JobKeyName] as JobKeyName
    ,em.[PositionId] as PositionId
    --,ps.[PositionName] as PositionName
    ,em.[DepartmentId] as DepartmentId
    --,dp.[NAME] as DepartmentName
    ,em.[DivisionId] as DivisionId
    --,ou.[OrganizationUnitId] as DivisionName
    ,em.[PersonnelAreaId] as PersonnelAreaId
    --,pa.[PersonnelAreaText] as PersonnelAreaName
    --,[ManagerId] as ManagerId
    ,[Fullname] as Fullname
    ,[Nickname] as Nickname
    ,[Email] as Email
    ,[Telephone] as Telephone
    --,em.[BeginDate] as BeginDate
    --,em.[EndDate] as EndDate
    --,[Status] as Status
    --,[CreatedDate] as CreatedDate
    --,[ModifiedDate] as ModifiedDate
    --,[Operated] as Operated
    ,[FullnameEN] as FullnameEn
    ,sc.[Password] as Secrets
    FROM [DBAUTHOR].[dbo].[Employees] em
    LEFT JOIN JobKeys jk ON em.JobKeyId = jk.JobKeyId
    LEFT JOIN Positions ps ON em.PositionId = ps.PositionId
    LEFT JOIN [DBMASTER].[dbo].[TBMaster_Department_Info] dp ON em.DepartmentId = dp.CODE
    LEFT JOIN Organization_Units ou ON em.DepartmentId = ou.OrganizationUnitId
    LEFT JOIN PersonnelAreas pa ON em.PersonnelAreaId = pa.PersonnelAreaId
    LEFT JOIN Secrets sc ON em.EmployeeId = sc.EmployeeId where em.EmployeeId = '${username}'`;

    const dataQuery = await this.connection.query(queryEmployee);
    const employee: Array<IEmployeeEntity> = dataQuery;
    if (!employee || employee.length !== 1) throw new InternalServerErrorException('Not found username');
    return employee[0];
    //return this.users.find((user) => user.username === username);
  }
}
