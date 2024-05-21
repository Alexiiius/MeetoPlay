import { SocialUser } from "./social-user";

export interface FriendsResponse {
  data: {
    message: string;
    Links: {
      self: string;
      user: string;
    };
    following_count: number;
    friends: SocialUser[];
  };
  meta: {
    timestamp: string;
  };
}

