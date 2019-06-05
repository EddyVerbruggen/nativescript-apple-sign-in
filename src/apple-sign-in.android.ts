export function isSignInWithAppleSupported(): boolean {
  return false;
}

export function getSignInWithAppleState(): Promise<any> {
  return Promise.reject("Not supported");
}

export function signInWithApple(): Promise<any> {
  return Promise.reject("Not supported");
}