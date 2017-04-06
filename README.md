
# react-native-spotify-auth

## Objectives

To have a unified library that allows to do Spotify authentication through their native SDK, both in iOS and Android.

## Installing

```bash
$ yarn add wiyarmir/react-native-spotify-auth
$ react-native link react-native-spotify-auth
```
  
Unfortunately, transitive AAR dependencies are not bundled. Since Spotify SDK is not published in Maven or pods, you need to manually include spotify lib from your project. 

### Android

There are two options for this.

#### Option 1

In your `android/build.gradle` file add the following:

```diff
allprojects {
    repositories {
        mavenLocal()
        jcenter()
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url "$rootDir/../node_modules/react-native/android"
         }
+        flatDir {
+            dirs "$rootDir/../node_modules/react-native-spotify-auth/android/libs"
+        }
         flatDir {
             dirs "libs"
         }
     }
}
```

#### Option 2

Add the Spotify auth `.aar` file to the `android/libs/` directory of your project. Current used version is `1.0.0-beta13` and can be found in [their GitHub repo](https://github.com/spotify/android-sdk/tree/1.0.0-beta13)

### iOS

WIP

## Usage

### API

The default export provides you with a class and flowtype annotations.

Method `startLogin()` returns a `Promise` that will resolve with a SpotifyAuthData type.

```js
type SpotifyAuthData = {
  token: string,
  code: string,
  error: string,
  state: string,
  expiresIn: number,
};
```

### Example

```js
import SpotifyAuth from 'react-native-spotify-auth';

let auth = new SpotifyAuth(Constants.SPOTIFY_CLIENT_ID, Constants.SPOTIFY_REDIRECT_URI);
auth.startLogin()
  .then(
    function(data) {
      console.log(data.token);
    },
    function(error){
      console.warn(error);
    }
  );
```

## Roadmap

### v0.9.0

- [ ] Android auth flow

### v1.0.0

- [ ] iOS auth flow

