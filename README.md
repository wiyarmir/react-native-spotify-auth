
# react-native-spotify-auth

## Objectives

To have a unified library that allows to do Spotify authentication through their native SDK, both in iOS and Android.

## Installing

```bash
$ yarn add wiyarmir/react-native-spotify-auth
$ react-native link react-native-spotify-auth
```
  
Unfortunately, transitive AAR dependencies are not bundled. Since Spotify SDK is not published in Maven, you need to manually include spotify lib from your project. 

There are two options for this.

### Option 1

#### Android

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

#### iOS

WIP

### Option 2

#### Android

Add the Spotify auth `.aar` file to the `android/libs/` directory of your project. Current used version is `1.0.0-beta13` and can be found in [their GitHub repo](https://github.com/spotify/android-sdk/tree/1.0.0-beta13)

#### iOS

WIP

## Roadmap

### v0.9.0

- [ ] Android auth flow

### v1.0.0

- [ ] iOS auth flow

