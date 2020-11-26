# [Sign In with Apple](https://developer.apple.com/sign-in-with-apple/), for NativeScript

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[npm-image]:https://img.shields.io/npm/v/nativescript-apple-sign-in.svg
[npm-url]:https://npmjs.org/package/nativescript-apple-sign-in
[downloads-image]:https://img.shields.io/npm/dm/nativescript-apple-sign-in.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

> Plugin version 2+ is compatible with NativeScript 7+. If you use an older NativeScript version, please use plugin version 1.1.0.

## Requirements

- Go to [the Apple developer website](https://developer.apple.com/account/resources/identifiers/list) and create a new app identifier with the "Sign In with Apple" Capability enabled. Make sure you sign your app with a provisioning profile using that app identifier.
- Open your app's `App_Resources/iOS` folder and [add this](https://github.com/EddyVerbruggen/nativescript-apple-sign-in/blob/master/demo/app/App_Resources/iOS/app.entitlements) (or append) to a file named `app.entitlements`. 

## Installation

```shell
tns plugin add nativescript-apple-sign-in
```

## Demo app

If you're stuck or want a quick demo of how this works, check out the demo app:

```shell
git clone https://github.com/EddyVerbruggen/nativescript-apple-sign-in
cd nativescript-apple-sign-in/src
npm run demo.ios
```

## API

### `isSignInWithAppleSupported`

Sign In with Apple was added in iOS 13, so make sure to call this function before showing a "Sign In with Apple" button in your app.
On iOS < 13 and Android this will return `false`.

```typescript
import { isSignInWithAppleSupported } from "nativescript-apple-sign-in";

const supported: boolean = isSignInWithAppleSupported();
```

### `signInWithApple`

Now that you know "Sign In with Apple" is supported on this device, you can have the
user sign themself in (after they pressed a nice button for instance).

```typescript
import { signInWithApple, SignInWithAppleAuthorization } from "nativescript-apple-sign-in";

signInWithApple(
    {
        // by default you don't get these details, but if you provide these scopes you will (and the user will get to choose which ones are allowed)
        scopes: ["EMAIL", "FULLNAME"]
    })
    .then((result: SignInWithAppleAuthorization) => {
        console.log("Signed in, credential: " + result.credential);
        console.log("Signed in, familyName: " + result.credential.fullName.familyName);
        // you can remember the user to check the sign in state later (see 'getSignInWithAppleState' below)
        this.user = result.credential.user;
    })
    .catch(err => console.log("Error signing in: " + err));
```

### `getSignInWithAppleState`

> ⚠️ This does not seem to work on a simulator!

If you want to know the current Sign In status of your user, you can pass the `user` (id) you acquired previously.

```typescript
import { getSignInWithAppleState } from "nativescript-apple-sign-in";

const user: string = "the id you got back from the signInWithApple function";

getSignInWithAppleState(user)
    .then(state => console.log("Sign in state: " + state))
    .catch(err => console.log("Error getting sign in state: " + err));
```
