#!/bin/bash
SDK_VERSION=1.0.0-beta13
SDK_FILE="SpotifySdkAndroid-$SDK_VERSION.zip"
SDK_URL=https://github.com/spotify/android-sdk/releases/download/1.0.0-beta13/$SDK_FILE
SDK_FOLDER="${SDK_FILE%.*}"
#MY_PATH="`dirname \"$0\"`"

rm -rf build/
mkdir -p build

cd build
wget $SDK_URL
unzip $SDK_FILE
cd ..

mkdir -p android/libs/ && cp "build/$SDK_FOLDER/spotify-auth-$SDK_VERSION.aar" android/libs/
