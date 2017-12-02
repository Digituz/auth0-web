import * as mockery from 'mockery';

mockery.enable();

const auth0Mock = {
  WebAuth: () => ({
    authorize: () => {},
    parseHash: (cb) => {
      const accessToken = 'some-access-token';
      const idToken = 'some-id-token';
      cb(null, {accessToken, idToken})
    }
  })
};

mockery.registerMock('auth0-js', auth0Mock);
