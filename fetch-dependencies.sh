#!/bin/bash
SDK_VERSION=1.0.0-beta13
SDK_FILE="SpotifySdkAndroid-$SDK_VERSION.zip"
SDK_URL=https://github.com/spotify/android-sdk/releases/download/1.0.0-beta13/$SDK_FILE
SDK_FOLDER="${SDK_FILE%.*}"
LIB_FILE_NAME=spotify-auth-$SDK_VERSION.aar
TARGET_FOLDER=android/libs/

if [ -f "$TARGET_FOLDER/$LIB_FILE_NAME" ]; then
  echo "$LIB_FILE_NAME already present in path '$TARGET_FOLDER', skipping download."
  exit 0
fi

rm -rf build/
mkdir -p build

cd build
curl -L $SDK_URL
unzip $SDK_FILE
cd ..

mkdir -p android/libs/ && cp "build/$SDK_FOLDER/$LIB_FILE_NAME" $TARGET_FOLDER
