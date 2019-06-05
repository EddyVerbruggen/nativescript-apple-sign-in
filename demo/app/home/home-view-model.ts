import { Observable } from "tns-core-modules/data/observable";
import { signInWithApple, isSignInWithAppleSupported, getSignInWithAppleState } from "nativescript-apple-sign-in";

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
                scopes: ["EMAIL"]
            })
            .then(credential => {
                console.log("Signed in, user: " + credential.user);
                this.user = credential.user;
            })
            .catch(err => console.log("Error signing in: " + err));
    }
}
