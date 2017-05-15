#!/usr/bin/env node

"use strict";

const SDK_VERSION = "1.0.0-beta13";
const SDK_FOLDER = `SpotifySdkAndroid-${SDK_VERSION}`;
const SDK_FILE = `${SDK_FOLDER}.zip`;
const SDK_URL = `https://github.com/spotify/android-sdk/releases/download/${SDK_VERSION}/${SDK_FILE}`;
const LIB_FILE_NAME = `spotify-auth-${SDK_VERSION}.aar`;
const TARGET_FOLDER = "android/libs/";

var fs = require("fs");
var http = require("https");
var path = require("path");
var url = require("url");
var zlib = require("zlib");

if (fs.existsSync(path.join(TARGET_FOLDER, LIB_FILE_NAME))) {
  console.log(
    `${LIB_FILE_NAME} already present in path '${TARGET_FOLDER}', skipping download.`
  );
  process.exit(0);
}

var deleteFolderRecursive = function(target) {
  if (fs.existsSync(target)) {
    fs.readdirSync(target).forEach(function(file, index) {
      var curPath = path.join(target, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(target);
  }
};

var createFolderRecursive = function(targetDir) {
  targetDir.split(path.sep).forEach((dir, index, splits) => {
    const parent = splits.slice(0, index).join(path.sep);
    const dirPath = path.resolve(parent, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
};

var download = function(targetUrl, destination) {
  http.get(targetUrl, function(res) {
    // Detect a redirect
    if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
      // The location for some (most) redirects will only contain the path,  not the hostname;
      // detect this and add the host to the path.
      var nextUrl;
      if (url.parse(res.headers.location).hostname) {
        // Hostname included; make request to res.headers.location
        nextUrl = res.headers.location;
      } else {
        nextUrl = url.parse(targetUrl).hostname + res.headers.location;
      }
      download(nextUrl, destination);
      return;
    }
    var file = fs.createWriteStream(destination);
    res.pipe(file).on("finish", function() {
      unpack(destination);
    });
  });
};

var unpack = function(sourceFile) {
  fs.createReadStream(sourceFile)
    .pipe(zlib.createDeflate())
    .pipe(fs.createWriteStream("build/dst"))
};

deleteFolderRecursive("build");

createFolderRecursive("build");
createFolderRecursive(TARGET_FOLDER);

var dst = path.join("build", SDK_FILE);

download(SDK_URL, dst);

/*
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
wget $SDK_URL
unzip $SDK_FILE
cd ..

mkdir -p android/libs/ && cp "build/$SDK_FOLDER/$LIB_FILE_NAME" $TARGET_FOLDER
*/
