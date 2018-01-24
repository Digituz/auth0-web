export {UserProfile, IdentityType};

// UserProfile and IdentityType were based on: https://auth0.com/docs/user-profile/user-profile-structure

type UserProfile = {
  email: string,
  userId: string,
  // below properties are optional
  username?: string,
  appMetadata?: string | any[],
  blocked?: boolean,
  created_at?: Date,
  email_verified?: boolean,
  identities?: IdentityType[],
  multifactor?: string[],
  lastIp?: string[],
  last_login?: Date,
  logins_count?: number,
  name?: string,
  nickname?: string,
  family_name?: string,
  given_name?: string,
  phoneNumber?: string,
  phone_verified?: boolean,
  picture?: string,
  updated_at?: Date,
  user_metadata?: string | any[]
};

type IdentityType = {
  user_id: string,
  // below properties are optional
  connection?: string,
  isSocial?: boolean,
  provider?: string
};
