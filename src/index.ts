export type SignInWithAppleScope = "EMAIL" | "FULLNAME";

export type SignInWithAppleState = "AUTHORIZED" | "NOTFOUND" | "REVOKED";

export declare interface SignInWithAppleOptions {
  user?: string;
  scopes?: Array<SignInWithAppleScope>;
}

// convenient enum based on ASUserDetectionStatus (XCode 11+)
export declare const enum SignInWithAppleUserDetectionStatus {
  Unsupported = 0,
  Unknown = 1,
  LikelyReal = 2
}

export declare interface SignInWithAppleName {
  familyName?: string;
  givenName?: string;
  middleName?: string;
  namePrefix?: string;
  nameSuffix?: string;
  nickname?: string;
  phoneticRepresentation?: SignInWithAppleName;
}

// This combines various interfaces of ASAuthorizationCredential types (XCode 11+)
// user can parse data out depending on scopes used
export interface SignInWithAppleCredential {
  accessToken?: string;
  authenticatedResponse?: any;
  authorizationCode?: string;
  authorizedScopes?: Array<string>;
  email?: string;
  fullName?: SignInWithAppleName;
  identityToken?: string;
  realUserStatus?: SignInWithAppleUserDetectionStatus;
  state?: string;
  user?: string;
  password?: string;
}

export interface SignInWithAppleAuthorization {
  credential: SignInWithAppleCredential;
  provider: any; // TODO (can extract convenient typing for this)
}

export declare function isSignInWithAppleSupported(): boolean;

export declare function getSignInWithAppleState(
  user: string
): Promise<SignInWithAppleState>;

export declare function signInWithApple(
  options?: SignInWithAppleOptions
): Promise<SignInWithAppleAuthorization>;
