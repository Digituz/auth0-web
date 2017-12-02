import {UserProfile} from "./profile";
import {Auth0Properties} from "./properties";
import * as auth0 from 'auth0-js';

export {
  configure,
  isAuthenticated,
  signIn,
  handleAuthCallback,
  signOut,
  getProfile,
  subscribe,
  Subscriber,
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
const RESPONSE_TYPE = 'token id_token';

function configure(properties: Auth0Properties): void {
  auth0Client = new auth0.WebAuth({
    ...properties,
    responseType: RESPONSE_TYPE
  });
}

function isAuthenticated(): boolean {
  const expiredsAt = localStorage.getItem(EXPIRES_AT);
  if (!expiredsAt) {
    return false;
  }
  return JSON.parse(expiredsAt) > Date.now();
}

function signIn(): void {
  auth0Client.authorize();
}

function handleAuthCallback(): void {
  // When Auth0 hash parsed, get profile
  auth0Client.parseHash((err, authResult: AuthResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      loadProfile(authResult);
    } else if (err) {
      console.error(`Error: ${err.error}`);
    }
  });
}

function signOut(): void {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(PROFILE);
  localStorage.removeItem(EXPIRES_AT);

  Object.keys(subscribers).forEach(key => {
    subscribers[key](false);
  });
}

function getProfile(): UserProfile | null {
  const profile = localStorage.getItem(PROFILE);
  return profile ? JSON.parse(profile) : null;
}

function subscribe(subscriber: Subscriber): { unsubscribe: () => void } {
  const subscriberKey = Date.now();
  subscribers[subscriberKey] = subscriber;
  subscribers[subscriberKey](isAuthenticated());
  return {
    unsubscribe: function() {
      delete subscribers[subscriberKey];
    }
  }
}

// the following properties and functions are private

let auth0Client: any;
let subscribers = {};

function loadProfile(authResult: AuthResult): void {
  auth0Client.client.userInfo(authResult.accessToken, (err, profile: UserProfile) => {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(ID_TOKEN, authResult.idToken);
    localStorage.setItem(PROFILE, JSON.stringify(profile));
    localStorage.setItem(EXPIRES_AT, JSON.stringify(expTime));

    Object.keys(subscribers).forEach(key => {
      subscribers[key](true);
    });
  });
}

type AuthResult = { accessToken: string, idToken: string, expiresIn: number };
type Subscriber = (signedIn) => void;
