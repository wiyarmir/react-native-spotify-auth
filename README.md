
# react-native-spotify-auth

Note: Heavily work in progress

  ```
  $ yarn add wiyarmir/react-native-spotify-auth
  $ react-native link react-native-spotify-auth
  ```
  
Unfortunately, until I figure out a better way, you need to manually exclude the spotify lib from your project. E.g, in your android subproject, go to  `app/build.gradle` and change

```groovy
compile project(':react-native-spotify-auth'))
```

To this

```groovy
compile(project(':react-native-spotify-auth')) {
    exclude group: 'com.spotify.sdk'
}
```

## Objectives

To have a unified library that allows to do Spotify authentication through their native SDK, both in iOS and Android.

## Roadmap

### v0.9.0

- [ ] Android auth flow

### v1.0.0

- [ ] iOS auth flow

