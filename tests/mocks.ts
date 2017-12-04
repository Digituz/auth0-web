import * as mockery from 'mockery';
import {UserProfile} from "../src/profile";
import {Auth0Properties} from "../src/properties";

mockery.enable({
  warnOnReplace: false,
  warnOnUnregistered: false
});

const auth0Mock = {
  WebAuth: (properties: Auth0Properties) => {
    let called = false;
    return {
      authorize: () => {
        called = true;
      },
      called: () => (called),
      client: {
        userInfo: (accessToken: string, cb: (err, profile: UserProfile) => void) => {
          cb(null, {email: 'bruno.krebs@auth0.com', userId: 'google-oauth2|100112663908880255058'});
        }
      },
      parseHash: (cb) => {
        const accessToken = 'some-access-token';
        const idToken = 'some-id-token';
        const expiresIn = 7200; // 2 hours
        cb(null, {accessToken, idToken, expiresIn})
      },
      properties: () => (properties),
    }
  }
};

mockery.registerMock('auth0-js', auth0Mock);
