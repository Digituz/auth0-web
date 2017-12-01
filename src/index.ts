import {UserProfile} from "./profile";
import {Auth0Properties} from "./properties";

export {configure, isAuthenticated, signIn, signOut, getProfile};

// the following functions are exported

function configure(properties: Auth0Properties): void {

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

// the following functions are private

function loadProfile(): void {

}

function setSignedIn(signedIn: boolean): void {

}

function parsesHash(): void {

}
