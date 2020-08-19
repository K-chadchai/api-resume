// เก็บ record การ login ทุกครั้ง

export interface ILoginActivity {
  id: string;
  user_id: string;
  login_time: Date; // วันเวลาที่กด login ( อาจจะผ่านหรือไม่ผ่าน ก็ได้ )
  login_success: string; // 1=สำเร็จ, 0=ไม่สำเร็จ
}
