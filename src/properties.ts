export {Auth0Properties};

// Auth0Properties was based on https://github.com/auth0/auth0.js

// as we favor convention over configuration and to keep things easy,
// we removed responseMode and responseType from this version

type Auth0Properties = {
  domain: string,
  clientID: string,
  redirectUri?: string,
  scope?: string,
  audience?: string,
  disableWarnings?: boolean,
  oauthFlow?: string;
};
