import { UserReduced } from "./user-reduced";

export interface Chat {
  from_user_id: number,
  to_user_id: number,
  user: UserReduced,
  unreadMessagesCount: number;
}
