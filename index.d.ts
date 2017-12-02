import {Auth0Properties} from './src/properties';
import {UserProfile} from './src/profile';
import {Subscriber} from "./src/index";

export function configure(properties: Auth0Properties): void;

export function isAuthenticated(): boolean;

export function signIn(): void;

export function handleAuthCallback(): void;

export function signOut(): void;

export function getProfile(): UserProfile | null;

export function subscribe(subscriber: Subscriber): { unsubscribe: () => void };

export type Subscriber = Subscriber;

export const ACCESS_TOKEN: string;
export const ID_TOKEN: string;
export const PROFILE: string;
export const EXPIRES_AT: string;
