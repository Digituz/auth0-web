import {Auth0Properties} from './src/properties';
import {UserProfile} from './src/profile';
import {Subscriber} from "./src/index";

export const auth0Client: any;

export function configure(properties: Auth0Properties): void;

export function isAuthenticated(): boolean;

export function signIn(): void;

export function handleAuthCallback(cb?: (err?: any) => void): void;

export function signOut(config?: { returnTo: string, clientID: string }): void;

export function getProfile(): UserProfile | null;

export function getAccessToken(): string | null;

export function getExtraToken(tokenName: string): string;

export function silentAuth(tokenName: string, audience: string, scopes: string): Promise<boolean>;

export function subscribe(subscriber: Subscriber): { unsubscribe: () => void };

export function updateProfile(userId: string, userMetadata: object, cb: any);

export type Subscriber = Subscriber;

export const ACCESS_TOKEN: string;
export const ID_TOKEN: string;
export const PROFILE: string;
export const EXPIRES_AT: string;
