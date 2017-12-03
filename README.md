[![Codecov](https://codecov.io/gh/brunokrebs/auth0-web/branch/master/graph/badge.svg)](https://codecov.io/gh/brunokrebs/auth0-web)
[![Auth0 Web build status][travis-image]][travis-url]
[![Code Coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]

## Auth0 Web

This is a wrapper around [Auth0.js](https://github.com/auth0/auth0.js) that favors convention over configuration. Using 
it on frameworks like Angular and React is quite easy. To use it, we basically have to do four things:

1. Install the dependency:

```bash
npm i auth0-web
```

2. Import it on some component:

```
import * as Auth0 from 'auth0-web';
```

3. Configure it with our Auth0 properties:

```javascript
Auth0.configure({
  domain: 'bk-samples.auth0.com',
  audience: 'https://contacts.digituz.com.br',
  clientID: '8a7myyLd6leG0HbOhMPtLaSgZ2itD3gK',
  redirectUri: 'http://localhost:3000/callback',
  responseType: 'token id_token',
  scope: 'openid get:contacts post:contacts delete:contacts'
});
```

4. Use the API:

```javascript
// triggers the authentication process
Auth0.signIn();

// handle authentication callback
Auth0.handleAuthCallback();

// get user profile
Auth0.getProfile();

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
```

<!-- vars -->
[codecov-image]: https://img.shields.io/codecov/c/github/brunokrebs/auth0-web/master.svg
[codecov-url]: https://codecov.io/github/brunokrebs/auth0-web?branch=master
[license-image]: http://img.shields.io/npm/l/auth0-web.svg
[license-url]: #license
[travis-image]: https://api.travis-ci.org/brunokrebs/auth0-web.svg?branch=master
[travis-url]: https://travis-ci.org/brunokrebs/auth0-web
