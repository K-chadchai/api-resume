import { IsNotEmpty } from 'class-validator';
// DTO
export class CreateUserDto {
  @IsNotEmpty()
  readonly employeeId: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly surname: string;
  readonly position: string;
  readonly role: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  readonly employeeId: string;
  readonly name: string;
  readonly surname: string;
}
