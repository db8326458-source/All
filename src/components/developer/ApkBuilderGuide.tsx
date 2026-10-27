import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  CloudRain,
  HelpCircle
} from 'lucide-react';

export const ApkBuilderGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const capacitorConfig = `{
  "appId": "com.helpworld.services",
  "appName": "HELP WORLD",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "cleartext": false
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2500,
      "launchAutoHide": true,
      "backgroundColor": "#0F172A",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP"
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#0F172A"
    }
  }
}`;

  const githubActionWorkflow = `name: Build Android APK (From Mobile)

on:
  workflow_dispatch: # Allows triggering directly from GitHub mobile browser!
  push:
    branches: [ main ]

jobs:
  build-apk:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v3
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Dependencies
        run: |
          npm ci
          npm install @capacitor/core @capacitor/cli @capacitor/android

      - name: Build Web Assets
        run: npm run build

      - name: Add Android Platform
        run: |
          npx cap add android
          npx cap copy android
          npx cap update android

      - name: Build Debug APK
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleDebug

      - name: Upload Debug APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: HelpWorld-Customer-Debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
`;

  return (
    <div className="space-y-6 pb-16 px-4 pt-4 max-w-4xl mx-auto text-xs text-slate-800">
      
      {/* Title */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-wider text-[11px]">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Mobile-Only Developer Setup</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white">
          Build & Install Android APKs Without a Computer
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-2xl">
          Because you are using only an Android phone, you do not need Android Studio or a PC. You can build official APK files directly in the cloud using free GitHub Actions and download the APK to install on your phone in under 5 minutes.
        </p>
      </div>

      {/* Step by Step Cloud Workflow */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
          <span>Step-by-Step APK Generation from Your Android Phone</span>
        </h2>

        <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-blue-100">
          <div className="space-y-1">
            <span className="font-bold text-slate-900 block">Step 1: Open GitHub in Chrome on Your Phone</span>
            <p className="text-slate-600 leading-relaxed">
              Create a free account on <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">github.com</a>. Create a new repository named <code className="bg-slate-100 px-1 rounded text-blue-700">help-world-app</code>.
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <span className="font-bold text-slate-900 block">Step 2: Add GitHub Actions Cloud Workflow</span>
            <p className="text-slate-600 leading-relaxed">
              Create a file located at <code className="bg-slate-100 px-1 rounded text-blue-700">.github/workflows/build-apk.yml</code> and paste the workflow below. GitHub provides 2,000 free cloud build minutes every month.
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <span className="font-bold text-slate-900 block">Step 3: Tap "Run Workflow" on Mobile</span>
            <p className="text-slate-600 leading-relaxed">
              In your GitHub mobile browser, go to the <strong>Actions</strong> tab → tap <strong>Build Android APK</strong> → tap <strong>Run workflow</strong>. The cloud server will compile the Android app.
            </p>
          </div>

          <div className="space-y-1 pt-2">
            <span className="font-bold text-slate-900 block">Step 4: Download and Install on Your Phone</span>
            <p className="text-slate-600 leading-relaxed">
              Once the green checkmark appears (~2 minutes), tap <strong>Artifacts</strong> → tap <strong>HelpWorld-Customer-Debug-APK</strong>. Your Android phone will download the <code className="bg-slate-100 px-1 rounded">.apk</code>. Tap open to install it!
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Build Script */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold text-white">.github/workflows/build-apk.yml</span>
          </div>
          <button
            onClick={() => copyToClipboard(githubActionWorkflow, 'workflow')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            {copiedSection === 'workflow' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'workflow' ? 'Copied!' : 'Copy Workflow'}</span>
          </button>
        </div>

        <pre className="p-3 bg-slate-900 rounded-xl overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed max-h-72">
          {githubActionWorkflow}
        </pre>
      </div>

      {/* Capacitor Configs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
      {/* Status Card */}
      <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="font-extrabold text-sm text-white">Android Configuration Status: Ready for Cloud Compilation</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Package ID</span>
            <span className="font-mono font-bold text-emerald-300">com.helpworld.services</span>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">App Name</span>
            <span className="font-bold text-emerald-300">HELP WORLD</span>
          </div>
          <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Capacitor Android</span>
            <span className="font-bold text-emerald-300">v8.5.3 (Synced)</span>
          </div>
        </div>
      </div>

      {/* Capacitor Config */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 block text-sm">Capacitor Android Configuration</span>
            <span className="text-[10px] text-slate-500 font-mono">capacitor.config.ts</span>
          </div>
          <button
            onClick={() => copyToClipboard(capacitorConfig, 'capacitor')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            {copiedSection === 'capacitor' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSection === 'capacitor' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <pre className="p-3 bg-slate-50 rounded-xl overflow-x-auto text-[10px] font-mono text-slate-800 max-h-56">
          {capacitorConfig}
        </pre>
      </div>

      </div>

      {/* Android Permissions Required */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">
          Required Android Manifest Permissions (<code className="font-mono text-xs">AndroidManifest.xml</code>)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-mono font-bold text-blue-700 block">android.permission.INTERNET</span>
            <span className="text-slate-500">Live Supabase sync, chat messages, and API calls</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-mono font-bold text-blue-700 block">android.permission.ACCESS_FINE_LOCATION</span>
            <span className="text-slate-500">Dispatches technicians within exact 5-25 km radius</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-mono font-bold text-blue-700 block">android.permission.CAMERA</span>
            <span className="text-slate-500">Allows partner to capture verification ID & job completion photos</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-mono font-bold text-blue-700 block">android.permission.POST_NOTIFICATIONS</span>
            <span className="text-slate-500">Real-time alerts for booking acceptance, messages, and status updates</span>
          </div>
        </div>
      </div>

    </div>
  );
};
