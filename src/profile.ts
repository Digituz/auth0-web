export {UserProfile, IdentityType};

// UserProfile and IdentityType were based on: https://auth0.com/docs/user-profile/user-profile-structure

class UserProfile {
  constructor(public email: string,
              public userId: string,
              public username: string,
              // optional below
              public appMetadata?: string | [],
              public blocked?: boolean,
              public createdAt?: DateTime,
              public emailVerified?: boolean,
              public identities?: IdentityType[],
              public multifactor?: string[],
              public lastIp?: string[],
              public lastLogin?: DateTime,
              public loginsCount?: number,
              public name?: string,
              public nickname?: string,
              public phoneNumber?: string,
              public phoneVerified?: boolean,
              public picture?: string,
              public updatedAt?: DateTime,
              public userMetadata?: string | []) {
  }
}

class IdentityType {
  constructor(public userId: string,
              // optional below
              public connection?: string,
              public isSocial?: boolean,
              public provider?: string)
}
