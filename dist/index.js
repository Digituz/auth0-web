"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth0 = require("auth0-js");
// the following functions are exported
var ACCESS_TOKEN = 'access_token';
exports.ACCESS_TOKEN = ACCESS_TOKEN;
var EXTRA_TOKENS = 'extra_tokens';
exports.EXTRA_TOKENS = EXTRA_TOKENS;
var ID_TOKEN = 'id_token';
exports.ID_TOKEN = ID_TOKEN;
var PROFILE = 'profile';
exports.PROFILE = PROFILE;
var EXPIRES_AT = 'expires_at';
exports.EXPIRES_AT = EXPIRES_AT;
var AUTHORIZATION_CODE = 'code';
exports.AUTHORIZATION_CODE = AUTHORIZATION_CODE;
var IMPLICTY_RESPONSE_TYPE = 'token id_token';
function configure(properties) {
    // defining responseType based on how/if the developer set `oauthFlow` property
    var responseType = properties.oauthFlow == AUTHORIZATION_CODE ? AUTHORIZATION_CODE : IMPLICTY_RESPONSE_TYPE;
    exports.auth0Client = auth0Client = new auth0.WebAuth(__assign({}, properties, { responseType: responseType }));
}
exports.configure = configure;
function isAuthenticated() {
    var expiredsAt = localStorage.getItem(EXPIRES_AT);
    if (!expiredsAt) {
        return false;
    }
    return JSON.parse(expiredsAt) > Date.now();
}
exports.isAuthenticated = isAuthenticated;
function signIn() {
    auth0Client.authorize();
}
exports.signIn = signIn;
function handleAuthCallback() {
    // When Auth0 hash parsed, get profile
    auth0Client.parseHash(function (err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            loadProfile(authResult);
        }
        else if (err) {
            console.error("Error: " + err.error);
        }
    });
}
exports.handleAuthCallback = handleAuthCallback;
function signOut() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXTRA_TOKENS);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(PROFILE);
    localStorage.removeItem(EXPIRES_AT);
    Object.keys(subscribers).forEach(function (key) {
        subscribers[key](false);
    });
}
exports.signOut = signOut;
function getProfile() {
    var profile = localStorage.getItem(PROFILE);
    return profile ? JSON.parse(profile) : null;
}
exports.getProfile = getProfile;
function subscribe(subscriber) {
    var subscriberKey = Date.now();
    subscribers[subscriberKey] = subscriber;
    subscribers[subscriberKey](isAuthenticated());
    return {
        unsubscribe: function () {
            delete subscribers[subscriberKey];
        }
    };
}
exports.subscribe = subscribe;
function silentAuth(tokenName, audience, scopes) {
    auth0Client.checkSession({ audience: audience, scopes: scopes }, function (err, authResult) {
        if (err) {
            console.log(err);
            return;
        }
        var extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS));
        extraTokens[tokenName] = authResult.accessToken;
    });
}
exports.silentAuth = silentAuth;
function getExtraToken(tokenName) {
    var extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS));
    return extraTokens[tokenName];
}
exports.getExtraToken = getExtraToken;
// the following properties and functions are private
var auth0Client;
exports.auth0Client = auth0Client;
var subscribers = {};
function loadProfile(authResult) {
    auth0Client.client.userInfo(authResult.accessToken, function (err, profile) {
        var expTime = authResult.expiresIn * 1000 + Date.now();
        // Save session data and update login status subject
        localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
        localStorage.setItem(EXTRA_TOKENS, JSON.stringify({}));
        localStorage.setItem(ID_TOKEN, authResult.idToken);
        localStorage.setItem(PROFILE, JSON.stringify(profile));
        localStorage.setItem(EXPIRES_AT, JSON.stringify(expTime));
        Object.keys(subscribers).forEach(function (key) {
            subscribers[key](true);
        });
    });
}
//# sourceMappingURL=index.js.map