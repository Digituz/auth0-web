import {UserProfile} from "./profile";
import {Auth0Properties} from "./properties";
import * as auth0 from 'auth0-js';

export {
  configure,
  isAuthenticated,
  signIn,
  parsesHash,
  signOut,
  getProfile,
  ACCESS_TOKEN,
  ID_TOKEN,
  PROFILE,
  EXPIRES_AT
};

// the following functions are exported

const ACCESS_TOKEN = 'access_token';
const ID_TOKEN = 'id_token';
const PROFILE = 'profile';
const EXPIRES_AT = 'expires_at';

function configure(properties: Auth0Properties): void {
  this.auth0Client = new auth0.WebAuth(properties);
}

function isAuthenticated(): boolean {
  return false;
}

function signIn(): void {
  this.auth0Client.authorize();
}

function parsesHash(): void {

}

function signOut(): void {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(PROFILE);
  localStorage.removeItem(EXPIRES_AT);
}

function getProfile(): UserProfile | null {
  return null;
}

// the following properties and functions are private

let auth0Client: any;

function loadProfile(): void {

}
