export {Auth0Properties};

// Auth0Properties was based on https://github.com/auth0/auth0.js

// as we favor convention over configuration and to keep things easy,
// we removed responseMode and responseType from this version

class Auth0Properties {
  constructor(public domain: string,
              public clientID: string,
              public redirectUri?: string,
              public scope?: string,
              public audience?: string,
              public disableWarnings = false)
}
