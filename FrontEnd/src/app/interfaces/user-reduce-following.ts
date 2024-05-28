import { UserReduced } from "./user-reduced";

export interface UserReduceFollowing extends UserReduced {
  isFollowing: boolean;
}
