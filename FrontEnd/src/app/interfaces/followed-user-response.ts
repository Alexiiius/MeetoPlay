import { SocialUser } from "./social-user";

export interface FollowedUsersResponse {
  data: {
    message: string;
    Links: {
      self: string;
      user: string;
    };
    following_count: number;
    following: SocialUser[];
  };
  meta: {
    timestamp: string;
  };
}
