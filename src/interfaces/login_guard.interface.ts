export interface ILoginGuard {
  id: string;
  user_id: string; // UC
  login_lock_id: string; // login_lock.id ( nullable )
}
