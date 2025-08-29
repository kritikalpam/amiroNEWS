# Amiro News - PWA Wrapper

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
    - **Name:** Your App Name (e.g., Amiro News)
    - **Package name:** com.example.amironews
    - **Language:** Kotlin
    - **Minimum SDK:** API 21 or higher is recommended.
5.  Click **Finish**.

### Step 2: Add Internet Permission (Crucial Step)

Your app needs permission to access the internet. If you miss this step, you will only see a blank screen in the emulator.

1.  Open `app/src/main/AndroidManifest.xml`.
2.  Add the following line just before the `<application>` tag:

    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    ```

### Step 3: Configure the WebView in the Layout

1.  Open `app/src/main/res/layout/activity_main.xml`.
2.  Replace the default `TextView` with a `WebView`. The file should look like this:

    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
        xmlns:app="http://schemas.android.com/apk/res-auto"
        xmlns:tools="http://schemas.android.com/tools"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        tools:context=".MainActivity">

        <WebView
            android:id="@+id/webview"
            android:layout_width="0dp"
            android:layout_height="0dp"
            app:layout_constraintBottom_toBottomOf="parent"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

    </androidx.constraintlayout.widget.ConstraintLayout>
    ```

### Step 4: Load Your Web App in the MainActivity

1.  Open `app/src/main/java/com/yourpackagename/MainActivity.kt`.
2.  Modify the `MainActivity` class to find the `WebView`, enable JavaScript, and load your deployed web app's URL. This is another critical step; if JavaScript is not enabled, your app will not load.

    ```kotlin
    package com.example.amironews // Make sure this matches your package name

    import android.os.Bundle
    import android.webkit.WebView
    import android.webkit.WebViewClient
    import androidx.appcompat.app.AppCompatActivity

    class MainActivity : AppCompatActivity() {
        override fun onCreate(savedInstanceState: Bundle?) {
            super.onCreate(savedInstanceState)
            setContentView(R.layout.activity_main)

            val webView: WebView = findViewById(R.id.webview)

            // Enable JavaScript (CRITICAL for modern web apps)
            webView.settings.javaScriptEnabled = true

            // Set a WebViewClient to handle navigation within the WebView itself
            // instead of opening links in the default browser.
            webView.webViewClient = WebViewClient()

            // Load your deployed PWA URL
            // IMPORTANT: Replace this with your actual public URL
            webView.loadUrl("https://amironews.com/")
        }
    }
    ```

### Step 5: Build and Run

You can now run your app on an Android emulator or a physical device. It should open and display your web application in a full-screen `WebView`. From here, you can follow the standard Google Play Store process for signing and publishing your app.
