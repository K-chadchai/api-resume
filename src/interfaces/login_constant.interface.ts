export interface ILoginConstant {
  id: string;
  failure_count: number; // จำนวนครั้งที่นับสะสมกรณีที่ไม่สำเร็จ ( เพื่อจะล็อค )
  failure_intime: number; // ถ้า login ไม่สำเร็จภายใน failure_intime นาทีเป็นจำนวน failure_count แล้วระบบจะล็อค
  lock_time_period: number; // จำนวนนาทีที่ระบบจะล็อค เมื่อคุณ login ไม่ผ่านตามเงื่อนไข ( null คือล็อคตลอดชาติ )
}
