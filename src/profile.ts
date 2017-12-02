export {UserProfile, IdentityType};

// UserProfile and IdentityType were based on: https://auth0.com/docs/user-profile/user-profile-structure

type UserProfile = {
  email: string,
  userId: string,
  // below properties are optional
  username?: string,
  appMetadata?: string | any[],
  blocked?: boolean,
  createdAt?: Date,
  emailVerified?: boolean,
  identities?: IdentityType[],
  multifactor?: string[],
  lastIp?: string[],
  lastLogin?: Date,
  loginsCount?: number,
  name?: string,
  nickname?: string,
  phoneNumber?: string,
  phoneVerified?: boolean,
  picture?: string,
  updatedAt?: Date,
  userMetadata?: string | any[]
};

type IdentityType = {
  userId: string,
  // below properties are optional
  connection?: string,
  isSocial?: boolean,
  provider?: string
};
