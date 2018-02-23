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
    currentProperties = properties;
    exports.auth0Client = auth0Client = new auth0.WebAuth(__assign({}, properties, { responseType: responseType }));
}
exports.configure = configure;
function isAuthenticated() {
    var expiredsAt = localStorage.getItem(EXPIRES_AT);
    if (!expiredsAt) {
        // just guaranteeing
        removeAuth0Props();
        return false;
    }
    var tokenStillValid = JSON.parse(expiredsAt) > Date.now();
    if (!tokenStillValid)
        removeAuth0Props();
    return tokenStillValid;
}
exports.isAuthenticated = isAuthenticated;
function signIn() {
    auth0Client.authorize();
}
exports.signIn = signIn;
function handleAuthCallback(cb) {
    // When Auth0 hash parsed, get profile
    auth0Client.parseHash(function (err, authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            loadProfile(authResult, cb);
        }
        else if (err) {
            console.error("Error: " + err.error);
        }
    });
}
exports.handleAuthCallback = handleAuthCallback;
function removeAuth0Props() {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXTRA_TOKENS);
    localStorage.removeItem(ID_TOKEN);
    localStorage.removeItem(PROFILE);
    localStorage.removeItem(EXPIRES_AT);
}
function signOut(config) {
    removeAuth0Props();
    if (!config) {
        return Object.keys(subscribers).forEach(function (key) {
            subscribers[key](false);
        });
    }
    var returnTo = config.returnTo, clientID = config.clientID;
    auth0Client.logout({
        returnTo: returnTo,
        clientID: clientID,
    });
}
exports.signOut = signOut;
function getProfile() {
    var profile = localStorage.getItem(PROFILE);
    return profile ? JSON.parse(profile) : null;
}
exports.getProfile = getProfile;
function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
}
exports.getAccessToken = getAccessToken;
function updateProfile(userId, userMetadata, cb) {
    var auth0Manage = new auth0.Management({
        domain: currentProperties.domain,
        token: localStorage.getItem(ID_TOKEN)
    });
    auth0Manage.patchUserMetadata(userId, userMetadata, function (err, updatedProfile) {
        if (err)
            cb(err);
        localStorage.setItem(PROFILE, JSON.stringify(updatedProfile));
        cb(null, updatedProfile);
    });
}
exports.updateProfile = updateProfile;
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
function silentAuth(tokenName, audience, scope) {
    return new Promise(function (resolve, reject) {
        if (scope.indexOf('openid') < 0) {
            scope = 'openid ' + scope;
        }
        auth0Client.checkSession({ audience: audience, scope: scope }, function (error, authResult) {
            if (error && error.error !== 'login_required') {
                // some other error
                return reject(error);
            }
            else if (error) {
                // explicit authentication required
                return resolve(false);
            }
            if (!isAuthenticated()) {
                handleAuthResult(null, authResult);
                return resolve(true);
            }
            var extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS));
            extraTokens[tokenName] = authResult.accessToken;
            localStorage.setItem(EXTRA_TOKENS, JSON.stringify(extraTokens));
            return resolve(true);
        });
    });
}
exports.silentAuth = silentAuth;
function getExtraToken(tokenName) {
    var extraTokens = JSON.parse(localStorage.getItem(EXTRA_TOKENS) || '{}');
    return extraTokens[tokenName];
}
exports.getExtraToken = getExtraToken;
// the following properties and functions are private
var auth0Client;
exports.auth0Client = auth0Client;
var subscribers = {};
var currentProperties = null;
function loadProfile(authResult, cb) {
    auth0Client.client.userInfo(authResult.accessToken, function (err, profile) {
        if (err && cb)
            return cb(err);
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
        if (cb)
            return cb();
    });
}
function handleAuthResult(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        loadProfile(authResult);
    }
    else if (err) {
        console.error("Error: " + err.error);
    }
}
//# sourceMappingURL=index.js.map