import {Device, Utils} from "@nativescript/core";
import {
    SignInWithAppleAuthorization,
    SignInWithAppleCredential,
    SignInWithAppleOptions,
    SignInWithAppleState
} from "./index";

let controller: any /* ASAuthorizationController */;
let delegate: ASAuthorizationControllerDelegateImpl;

declare const ASAuthorizationAppleIDProvider,
    ASAuthorizationController,
    ASAuthorizationControllerDelegate,
    ASAuthorizationScopeEmail,
    ASAuthorizationScopeFullName: any;

export function isSignInWithAppleSupported(): boolean {
    return parseInt(Device.osVersion) >= 13;
}

export function getSignInWithAppleState(
    user: string
): Promise<SignInWithAppleState> {
    return new Promise<any>((resolve, reject) => {
        if (!user) {
            reject("The 'user' parameter is mandatory");
            return;
        }

        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }

        const provider = ASAuthorizationAppleIDProvider.new();
        provider.getCredentialStateForUserIDCompletion(user, (
            state: any /* enum: ASAuthorizationAppleIDProviderCredentialState */,
            error: NSError
        ) => {
            if (error) {
                reject(error.localizedDescription);
                return;
            }

            if (state === 1) {
                // ASAuthorizationAppleIDProviderCredential.Authorized
                resolve("AUTHORIZED");
            } else if (state === 2) {
                // ASAuthorizationAppleIDProviderCredential.NotFound
                resolve("NOTFOUND");
            } else if (state === 3) {
                // ASAuthorizationAppleIDProviderCredential.Revoked
                resolve("REVOKED");
            } else {
                // this prolly means a state was added so we need to add it to the plugin
                reject(
                    "Invalid state for getSignInWithAppleState: " +
                    state +
                    ", please report an issue at he plugin repo!"
                );
            }
        });
    });
}

export function signInWithApple(
    options?: SignInWithAppleOptions
): Promise<SignInWithAppleAuthorization> {
    return new Promise<any>((resolve, reject) => {
        if (!isSignInWithAppleSupported()) {
            reject("Not supported");
            return;
        }

        const provider = ASAuthorizationAppleIDProvider.new();
        const request = provider.createRequest();

        if (options && options.user) {
            request.user = options.user;
        }

        if (options && options.scopes) {
            const nsArray = NSMutableArray.new();
            options.scopes.forEach(s => {
                if (s === "EMAIL") {
                    nsArray.addObject(ASAuthorizationScopeEmail);
                } else if (s === "FULLNAME") {
                    nsArray.addObject(ASAuthorizationScopeFullName);
                } else {
                    console.log(
                        "Unsupported scope: " + s + ", use either EMAIL or FULLNAME"
                    );
                }
            });
            request.requestedScopes = nsArray;
        }

        controller = ASAuthorizationController.alloc().initWithAuthorizationRequests(
            Utils.ios.collections.jsArrayToNSArray([request])
        );
        controller.delegate = delegate = ASAuthorizationControllerDelegateImpl.createWithPromise(
            resolve,
            reject
        );
        controller.performRequests();
    });
}

@NativeClass()
class ASAuthorizationControllerDelegateImpl extends NSObject /* implements ASAuthorizationControllerDelegate */ {
    public static ObjCProtocols = [];
    private resolve;
    private reject;

    public static new(): ASAuthorizationControllerDelegateImpl {
        try {
            ASAuthorizationControllerDelegateImpl.ObjCProtocols.push(
                ASAuthorizationControllerDelegate
            );
            return <ASAuthorizationControllerDelegateImpl>super.new();
        } catch (ignore) {
            console.log(
                "Apple Sign In not supported on this device - it requires iOS 13+. Tip: use 'isSignInWithAppleSupported' before calling 'signInWithApple'."
            );
            return null;
        }
    }

    public static createWithPromise(
        resolve,
        reject
    ): ASAuthorizationControllerDelegateImpl {
        const delegate = <ASAuthorizationControllerDelegateImpl>(
            ASAuthorizationControllerDelegateImpl.new()
        );
        if (delegate === null) {
            reject("Not supported");
        } else {
            delegate.resolve = resolve;
            delegate.reject = reject;
        }
        return delegate;
    }

    authorizationControllerDidCompleteWithAuthorization(
        controller: any /* ASAuthorizationController */,
        authorization: {
            provider: any;
            credential: SignInWithAppleCredential & {
                accessToken?: NSData;
                authenticatedResponse?: NSHTTPURLResponse;
                authorizationCode?: NSData;
                authorizedScopes?: NSArray<string>;
                identityToken?: NSData;
            };
        }
    ): void {
        if (authorization && authorization.credential) {
            const data: SignInWithAppleAuthorization = {
                provider: authorization.provider,
                credential: {
                    // primitive data
                    email: authorization.credential.email,
                    fullName: authorization.credential.fullName,
                    realUserStatus: authorization.credential.realUserStatus,
                    state: authorization.credential.state,
                    user: authorization.credential.user,
                    password: authorization.credential.password
                }
            };
            // then in addition for added convenience, convert some native objects to friendly js
            if (authorization.credential.accessToken) {
                data.credential.accessToken = <string>(<unknown>NSString.alloc()
                    .initWithDataEncoding(
                        authorization.credential.accessToken,
                        NSUTF8StringEncoding
                    )
                    .toString());
            }
            if (authorization.credential.authorizationCode) {
                data.credential.authorizationCode = <string>(<unknown>NSString.alloc()
                    .initWithDataEncoding(
                        authorization.credential.authorizationCode,
                        NSUTF8StringEncoding
                    )
                    .toString());
            }
            if (authorization.credential.authorizedScopes) {
                data.credential.authorizedScopes = Utils.ios.collections.nsArrayToJSArray(
                    authorization.credential.authorizedScopes
                );
            }
            if (authorization.credential.identityToken) {
                data.credential.identityToken = <string>(<unknown>NSString.alloc()
                    .initWithDataEncoding(
                        authorization.credential.identityToken,
                        NSUTF8StringEncoding
                    )
                    .toString());
            }
            this.resolve(data);
        } else {
            this.reject("auth error: no credential returned.");
        }
    }

    authorizationControllerDidCompleteWithError(
        controller: any /* ASAuthorizationController */,
        error: NSError
    ): void {
        this.reject(error.localizedDescription);
    }
}
