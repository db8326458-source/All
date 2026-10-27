#!/usr/bin/env bash
set -e

echo "=== STEP 1: Setting up Android SDK directories ==="
export ANDROID_HOME="/opt/android-sdk"
mkdir -p "$ANDROID_HOME/cmdline-tools"
cd "$ANDROID_HOME"

echo "=== STEP 2: Downloading Google Android Command Line Tools ==="
curl -fsSL https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -o cmdline-tools.zip
unzip -q cmdline-tools.zip -d "$ANDROID_HOME/cmdline-tools"
rm cmdline-tools.zip

# Capacitor/Android SDK structure requires cmdline-tools/latest
if [ -d "$ANDROID_HOME/cmdline-tools/cmdline-tools" ]; then
    rm -rf "$ANDROID_HOME/cmdline-tools/latest"
    mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
fi

export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "=== STEP 3: Accepting SDK Licenses ==="
yes | sdkmanager --licenses > /dev/null 2>&1 || true

echo "=== STEP 4: Installing Platform Tools, Build Tools, and Platforms ==="
# Install platforms (android-34 is standard stable)
sdkmanager "platform-tools" "build-tools;34.0.0" "platforms;android-34"

echo "=== STEP 5: Setting local.properties in android project ==="
cd /app/applet/android
echo "sdk.dir=$ANDROID_HOME" > local.properties

echo "=== STEP 6: Adjusting variables.gradle for compileSdk 34 ==="
sed -i 's/compileSdkVersion = 36/compileSdkVersion = 34/g' variables.gradle || true
sed -i 's/targetSdkVersion = 36/targetSdkVersion = 34/g' variables.gradle || true

echo "=== STEP 7: Compiling Debug APK with Gradle ==="
chmod +x gradlew
./gradlew assembleDebug --no-daemon

echo "=== STEP 8: Verifying and copying generated APK ==="
APK_SOURCE="/app/applet/android/app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_SOURCE" ]; then
    echo "SUCCESS: Found $APK_SOURCE"
    ls -lh "$APK_SOURCE"
    mkdir -p /app/applet/public
    mkdir -p /app/applet/dist
    cp "$APK_SOURCE" /app/applet/public/helpworld-debug.apk
    cp "$APK_SOURCE" /app/applet/dist/helpworld-debug.apk
    cp "$APK_SOURCE" /app/applet/helpworld-debug.apk
    echo "=== APK successfully generated at /app/applet/public/helpworld-debug.apk ==="
else
    echo "ERROR: APK was not found at $APK_SOURCE"
    exit 1
fi
