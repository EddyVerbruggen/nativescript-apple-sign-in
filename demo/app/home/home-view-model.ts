import { Observable } from "@nativescript/core";
import { getSignInWithAppleState, isSignInWithAppleSupported, signInWithApple, SignInWithAppleAuthorization } from "nativescript-apple-sign-in";

export class HomeViewModel extends Observable {

    private user: string;

    isSupported(): void {
        console.log(isSignInWithAppleSupported() ? "YES" : "NO");
    }

    getSignInState(): void {
        getSignInWithAppleState(this.user)
            .then(state => console.log("Sign in state: " + state))
            .catch(err => console.log("Error getting sign in state: " + err));
    }

    signIn(): void {
        signInWithApple(
            {
                scopes: ["EMAIL", "FULLNAME"]
            })
            .then((result: SignInWithAppleAuthorization) => {
                console.log("Signed in, credential: " + JSON.stringify(result.credential));
                console.log("Signed in, familyName: " + result.credential.fullName.familyName);
                console.log("Signed in, user (id): " + result.credential.user);
                console.log("Signed in, provider: " + result.provider);
                this.user = result.credential.user;
            })
            .catch(err => console.log("Error signing in: " + err));
    }
}
