import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IEmployeeEntity } from 'src/interfaces/employees';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('mssql')
    private readonly connection: Connection,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    const queryEmployee = `SELECT TOP (1) em.[EmployeeId] as EmployeeId
    ,em.[JobKeyId] as JobKeyId
    ,em.[PositionId] as PositionId
    ,em.[DepartmentId] as DepartmentId
    ,em.[DivisionId] as DivisionId
    ,em.[PersonnelAreaId] as PersonnelAreaId
    ,[Fullname] as Fullname
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
    if (!employee || employee.length !== 1) {
      throw new InternalServerErrorException('Not found username');
    }
    return employee[0];
    //return this.users.find((user) => user.username === username);
  }
}
