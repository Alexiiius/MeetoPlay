import { UserSocials } from "./user-socials";

export interface UserData {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  tag: string;
  avatar: string;
  date_of_birth: string;
  status: string;
  is_admin: boolean;
  bio: string;
  socials: UserSocials
  email_verification_token: string;
  created_at: string;
  updated_at: string;
}
