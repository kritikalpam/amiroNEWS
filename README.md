# amiroNEWS - PWA Wrapper

This project is a simple Next.js application that acts as a dedicated, full-screen browser for the [Amiro News](https://amironews.com/) website. It is configured as a Progressive Web App (PWA), allowing it to be "installed" on a user's home screen for an app-like experience.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 14
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PWA**: [next-pwa](https://www.npmjs.com/package/next-pwa) for offline capabilities and app-like installation.
- **Push Notifications**: [OneSignal](https://onesignal.com/)

## Features

- **Full-Screen Browsing**: Displays the Amiro News website in an immersive, full-screen iframe.
- **Progressive Web App**:
    - Installable on mobile and desktop devices for easy access.
    - Includes a manifest file and icons for a native-like appearance.
    - Service worker for offline caching of application assets.
- **Push Notifications**: Integrated with OneSignal to allow for push notifications.

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production-ready build of the application, run the following command:

```bash
npm run build
```

This will generate an optimized version of the app in the `.next` directory. You can then start the production server with:

```bash
npm start
```

## Building for Android (Android Studio Guide)

While this is a web application, you can wrap it in a native Android app using a `WebView`. This allows you to publish it on the Google Play Store.

**Prerequisite:** You must first deploy your Next.js application to a public URL (e.g., using Vercel, Netlify, or your own server).

### Step 1: Create a New Android Studio Project

1.  Open Android Studio.
2.  Click **File > New > New Project...**.
3.  Select the **Empty Views Activity** template and click **Next**.
4.  Configure your project:
    - **Name:** amiroNEWS
    - **Package name:** com.amiro.news
    - **Language:** Kotlin
    - **Minimum SDK:** API 21 or higher is recommended.
5.  Click **Finish**.

### Step 2: Configure the Android Manifest

Your app needs the right permissions and configuration to access the internet and handle deep links.

1.  Open `app/src/main/AndroidManifest.xml`.
2.  Replace the entire contents of the file with the following code. This manifest includes internet permissions, deep link handling for `amironews.com`, and other production-ready settings.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        package="com.amiro.news">

        <uses-permission android:name="android.permission.INTERNET"/>
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

        <application
            android:usesCleartextTraffic="false"
            android:networkSecurityConfig="@xml/network_security_config"
            android:allowBackup="true"
            android:label="amiroNEWS"
            android:icon="@mipmap/ic_launcher"
            android:roundIcon="@mipmap/ic_launcher_round"
            android:supportsRtl="true"
            android:theme="@style/Theme.Material3.DayNight.NoActionBar">
            <activity
                android:name=".MainActivity"
                android:exported="true"
                android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode"
                android:launchMode="singleTop">
                <intent-filter>
                    <action android:name="android.intent.action.MAIN"/>
                    <category android:name="android.intent.category.LAUNCHER"/>
                </intent-filter>

                <!-- Handle app links for amironews.com -->
                <intent-filter android:autoVerify="true">
                    <action android:name="android.intent.action.VIEW"/>
                    <category android:name="android.intent.category.DEFAULT"/>
                    <category android:name="android.intent.category.BROWSABLE"/>
                    <data android:scheme="https" android:host="www.amironews.com"/>
                    <data android:scheme="https" android:host="amironews.com"/>
                </intent-filter>
            </activity>
        </application>
    </manifest>
    ```

3.  **Note on Network Security:** The manifest above references a `network_security_config` file. This enhances security by ensuring your app only communicates with specific domains over HTTPS. You must create this file. Go to `app/src/main/res/`, create a new directory named `xml`, and inside `xml`, create a new file named `network_security_config.xml` with the following content:

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <network-security-config>
        <domain-config cleartextTrafficPermitted="false">
            <domain includeSubdomains="true">amironews.com</domain>
        </domain-config>
    </network-security-config>
    ```

### Step 3: Configure the WebView Layout with a Progress Bar

1.  Open `app/src/main/res/layout/activity_main.xml`.
2.  Replace the default content with the following `FrameLayout`, which includes both the `WebView` and a `ProgressBar`.

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent" android:layout_height="match_parent">

        <ProgressBar
            android:id="@+id/progressBar"
            style="?android:attr/progressBarStyleHorizontal"
            android:layout_width="match_parent"
            android:layout_height="3dp"
            android:indeterminate="false"
            android:visibility="gone"/>

        <android.webkit.WebView
            android:id="@+id/webview"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>
    </FrameLayout>
    ```

### Step 4: Load Your Web App and Manage the Progress Bar

1.  Open `app/src/main/java/com/amiro/news/MainActivity.kt`.
2.  Modify the `MainActivity` class to enable JavaScript, handle back-press navigation, and manage the `ProgressBar`.

    ```kotlin
    package com.amiro.news

    import android.os.Bundle
    import android.view.View
    import android.webkit.WebChromeClient
    import android.webkit.WebView
    import android.webkit.WebViewClient
    import android.widget.ProgressBar
    import androidx.activity.OnBackPressedCallback
    import androidx.appcompat.app.AppCompatActivity

    class MainActivity : AppCompatActivity() {
        private lateinit var webView: WebView
        private lateinit var progressBar: ProgressBar

        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)

            webView = findViewById(R.id.webview)
            progressBar = findViewById(R.id.progressBar)

            // Enable JavaScript (CRITICAL for modern web apps)
            webView.settings.javaScriptEnabled = true

            // Set clients for handling rendering and navigation
            webView.webViewClient = WebViewClient()
            webView.webChromeClient = object : WebChromeClient() {
                override fun onProgressChanged(view: WebView?, newProgress: Int) {
                    if (newProgress < 100) {
                        progressBar.visibility = View.VISIBLE
                        progressBar.progress = newProgress
                    } else {
                        progressBar.visibility = View.GONE
                    }
                }
            }

            // Handle the back button to navigate in WebView history
            onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        // If there's no history, proceed with default back behavior
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            })

            // Load your deployed PWA URL
            webView.loadUrl("https://amironews.com/")
        }
    }
    ```

### Step 5: Build and Run

You can now run your app on an Android emulator or a physical device. It should open, display your web application in a full-screen `WebView`, and show a progress bar at the top as the page loads. From here, you can follow the standard Google Play Store process for signing and publishing your app.
