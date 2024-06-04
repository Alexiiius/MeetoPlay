import { ChatMessage } from "./chat-message";

export interface Messages {
  current_page: number;
  data: ChatMessage[];
  from: number;
  to: number;
  last_page: number;
  path: string;
}
