export interface SocketPublicMessage {
  id: number;
  from_user_id: number;
  to_user_id: number;
  from_user_name: string;
  text: string;
  time: string;
  color: string;
}
