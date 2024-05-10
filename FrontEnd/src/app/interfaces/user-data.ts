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
  socials: {
    github: string;
    twitter: string;
    website: string;
    facebook: string;
    linkedin: string;
    instagram: string;
    discord: string;
  }
  email_verification_token: string;
  created_at: string;
  updated_at: string;
}
