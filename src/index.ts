import {UserProfile} from "./profile";
import {Auth0Properties} from "./properties";
import * as auth0 from 'auth0-js';

export {
  auth0Client,
  configure,
  isAuthenticated,
  signIn,
  handleAuthCallback,
  signOut,
  getExtraToken,
  getProfile,
  silentAuth,
  subscribe,
  Subscriber,
  ACCESS_TOKEN,
  AUTHORIZATION_CODE,
  EXPIRES_AT,
  EXTRA_TOKENS,
  ID_TOKEN,
  PROFILE
};

// the following functions are exported

const ACCESS_TOKEN = 'access_token';
const EXTRA_TOKENS = 'extra_tokens';
const ID_TOKEN = 'id_token';
const PROFILE = 'profile';
const EXPIRES_AT = 'expires_at';
const AUTHORIZATION_CODE = 'code';
const IMPLICTY_RESPONSE_TYPE = 'token id_token';

function configure(properties: Auth0Properties): void {
  // defining responseType based on how/if the developer set `oauthFlow` property
  let responseType = properties.oauthFlow == AUTHORIZATION_CODE ? AUTHORIZATION_CODE : IMPLICTY_RESPONSE_TYPE;
  auth0Client = new auth0.WebAuth({
    ...properties,
    responseType
  });
}

function isAuthenticated(): boolean {
  const expiredsAt = localStorage.getItem(EXPIRES_AT);
  if (!expiredsAt) {
    // just guaranteeing
    removeAuth0Props();
    return false;
  }
  const tokenStillValid = JSON.parse(expiredsAt) > Date.now();
  if (!tokenStillValid) removeAuth0Props();
  return tokenStillValid;
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

function removeAuth0Props() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(EXTRA_TOKENS);
  localStorage.removeItem(ID_TOKEN);
  localStorage.removeItem(PROFILE);
  localStorage.removeItem(EXPIRES_AT);
}

function signOut(): void {
  removeAuth0Props();
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
    unsubscribe: function () {
      delete subscribers[subscriberKey];
    }
  }
}

function silentAuth(tokenName, audience, scope): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    auth0Client.checkSession({ audience, scope }, function (err, authResult) {
      if (err) return reject(err);
      const extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS));
      extraTokens[tokenName] = authResult.accessToken;
      localStorage.setItem(EXTRA_TOKENS, JSON.stringify(extraTokens));
      return resolve();
    });
  });
}

function getExtraToken(tokenName) {
  const extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS) || '{}');
  return extraTokens[tokenName];
}

// the following properties and functions are private

let auth0Client: any;
let subscribers = {};

function loadProfile(authResult: AuthResult): void {
  auth0Client.client.userInfo(authResult.accessToken, (err, profile: UserProfile) => {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
    localStorage.setItem(EXTRA_TOKENS, JSON.stringify({}));
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
