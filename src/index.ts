import {UserProfile} from "./profile";
import {Auth0Properties} from "./properties";
import * as auth0 from 'auth0-js';

export {configure, isAuthenticated, signIn, signOut, getProfile};

// the following functions are exported

function configure(properties: Auth0Properties): void {
  this.auth0Client = new auth0.WebAuth(properties);
}

function isAuthenticated(): boolean {
  return false;
}

function signIn(): void {

}

function signOut(): void {

}

function getProfile(): UserProfile | null {
  return null;
}

// the following properties and functions are private

let auth0Client: any;

function loadProfile(): void {

}

function setSignedIn(signedIn: boolean): void {

}

function parsesHash(): void {

}
