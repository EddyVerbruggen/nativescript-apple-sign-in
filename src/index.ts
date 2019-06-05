export type SignInWithAppleScope = "EMAIL" | "FULLNAME";

export type SignInWithAppleState = "AUTHORIZED" | "NOTFOUND" | "REVOKED";

export declare interface SignInWithAppleOptions {
  user?: string;
  scopes?: Array<SignInWithAppleScope>;
}

export declare interface SignInWithAppleCredentials {
  user: string;
  // scopes: Array<SignInWithAppleScope>;
}

export declare function isSignInWithAppleSupported(): boolean;

export declare function getSignInWithAppleState(user: string): Promise<SignInWithAppleState>;

export declare function signInWithApple(options?: SignInWithAppleOptions): Promise<SignInWithAppleCredentials>;