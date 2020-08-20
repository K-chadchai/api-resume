// ถ้า user มีการ login เข้ามาในระบบแล้วใส่รหัสผ่านผิด

export interface ILoginLock {
  id: string; // PK
  user_id: string;
  time_begin: Date; // เวลาที่เริ่ม lock ( not null )
  time_end: Date | undefined | null; // เวลาที่สิ้นสุดการ lock ( nullable ) ( ถ้าเป็น null ให้ล็อคตลอด ) ( ถ้าไม่ใช้ null ต้องมากกว่า time_begin เสมอ)
  login_activity_id: string;
}
