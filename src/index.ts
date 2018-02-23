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
  getAccessToken,
  getExtraToken,
  getProfile,
  silentAuth,
  subscribe,
  Subscriber,
  updateProfile,
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
  currentProperties = properties;
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

function handleAuthCallback(cb?: (err?: any) => void): void {
  // When Auth0 hash parsed, get profile
  auth0Client.parseHash((err, authResult: AuthResult) => {
    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      loadProfile(authResult, cb);
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

function signOut(config?: { returnTo: string, clientID: string }): void {
  removeAuth0Props();
  if (!config) {
    return Object.keys(subscribers).forEach(key => {
      subscribers[key](false);
    });
  }
  const { returnTo, clientID } = config;
  auth0Client.logout({
    returnTo,
    clientID,
  });
}

function getProfile(): UserProfile | null {
  const profile = localStorage.getItem(PROFILE);
  return profile ? JSON.parse(profile) : null;
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

function updateProfile(userId, userMetadata, cb): void {
  const auth0Manage = new auth0.Management({
    domain: currentProperties.domain,
    token: localStorage.getItem(ID_TOKEN)
  });

  auth0Manage.patchUserMetadata(userId, userMetadata, (err, updatedProfile) => {
    if (err) cb(err);
    localStorage.setItem(PROFILE, JSON.stringify(updatedProfile));
    cb(null, updatedProfile);
  });
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

function silentAuth(tokenName, audience, scope): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (scope.indexOf('openid') < 0) {
      scope = 'openid ' + scope;
    }
    auth0Client.checkSession({audience, scope}, function (error, authResult) {
      if (error && error.error !== 'login_required') {
        // some other error
        return reject(error);
      } else if (error) {
        // explicit authentication required
        return resolve(false);
      }

      if (!isAuthenticated()) {
        handleAuthResult(null, authResult);
        return resolve(true);
      }

      const extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS));
      extraTokens[tokenName] = authResult.accessToken;
      localStorage.setItem(EXTRA_TOKENS, JSON.stringify(extraTokens));
      return resolve(true);
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
let currentProperties = null;

function loadProfile(authResult: AuthResult, cb?: (err?: any) => void): void {
  auth0Client.client.userInfo(authResult.accessToken, (err, profile: UserProfile) => {
    if (err && cb) return cb(err);
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
    if (cb) return cb();
  });
}

function handleAuthResult(err, authResult: AuthResult) {
  if (authResult && authResult.accessToken && authResult.idToken) {
    window.location.hash = '';
    loadProfile(authResult);
  } else if (err) {
    console.error(`Error: ${err.error}`);
  }
}

type AuthResult = { accessToken: string, idToken: string, expiresIn: number };
type Subscriber = (signedIn) => void;
