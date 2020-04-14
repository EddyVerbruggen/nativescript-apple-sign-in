export type SignInWithAppleScope = "EMAIL" | "FULLNAME";

export type SignInWithAppleState = "AUTHORIZED" | "NOTFOUND" | "REVOKED";

export declare interface SignInWithAppleOptions {
  user?: string;
  scopes?: Array<SignInWithAppleScope>;
}

export declare interface Name {
  givenName?: string;
  middleName?: string;
  familyName?: string;
}

export declare interface SignInWithAppleCredentials {
  user: string;
  identityToken: string;
  fullName?: string;
  email?: string;
}

export declare function isSignInWithAppleSupported(): boolean;

export declare function getSignInWithAppleState(user: string): Promise<SignInWithAppleState>;

export declare function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleCredentials>;
