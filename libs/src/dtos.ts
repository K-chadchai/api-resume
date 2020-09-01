export class TokenDto {
  userId: string;
  userName: string;
  uuid: string; // login_activity_id
  employeeLevel: string; // C1,C2,C3
  actionTime: Date; // เวลาที่เรียก api
}
