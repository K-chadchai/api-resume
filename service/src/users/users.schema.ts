import { Document, Schema } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

// Interface
export interface TUsersInterface extends Document {
  readonly employeeId: string;
  readonly name: string;
  readonly surname: string;
  readonly position: string;
  readonly role: string;
  readonly created: Date;
}

// Schema
export const TUsersSchema = new Schema({
  employeeId: { type: String, index: true, unique: true, uppercase: true },
  name: String,
  surname: String,
  position: String,
  role: String,
  created: { type: Date, default: Date.now },
});
TUsersSchema.index({ name: 1, surname: 1 }, { unique: true });

// DTO
export class CreateUserDto {
  @IsNotEmpty()
  readonly ememployeeId: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly surname: string;
  readonly position: string;
  readonly role: string;
}
