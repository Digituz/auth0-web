import * as mockery from 'mockery';
import {UserProfile} from "../src/profile";

mockery.enable();

const auth0Mock = {
  WebAuth: () => ({
    authorize: () => {},
    parseHash: (cb) => {
      const accessToken = 'some-access-token';
      const idToken = 'some-id-token';
      const expiresIn = 7200; // 2 hours
      cb(null, {accessToken, idToken, expiresIn})
    },
    client: {
      userInfo: (accessToken: string, cb: (err, profile: UserProfile) => void) => {
        cb(null, new UserProfile('bruno.krebs@auth0.com', 'google-oauth2|100112663908880255058'));
      }
    }
  })
};

mockery.registerMock('auth0-js', auth0Mock);
