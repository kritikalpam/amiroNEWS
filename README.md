# Android (Kotlin) — open in Android Studio

## 1) Create project

1. Android Studio → *New Project* → **Empty Views Activity**
2. Name: `AmiroNews`
3. Package: `com.amiro.news`
4. Minimum SDK: **21 (Android 5.0)** or higher
5. Language: **Kotlin**

## 2) app/build.gradle

Make sure these bits exist:

```gradle
android {
    namespace "com.amiro.news"
    compileSdk 34

    defaultConfig {
        applicationId "com.amiro.news"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }
}
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
}
```

## 3) AndroidManifest.xml

`app/src/main/AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    <application
        android:usesCleartextTraffic="false"
        android:networkSecurityConfig="@xml/network_security_config"
        android:allowBackup="true"
        android:label="AmiroNews"
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

            <!-- Optional: handle app links like amironews.com -->
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

## 4) Network Security (good defaults)

`app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">amironews.com</domain>
        <domain includeSubdomains="true">www.amironews.com</domain>
    </domain-config>
</network-security-config>
```

## 5) Layout

`app/src/main/res/layout/activity_main.xml`

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
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"/>
</FrameLayout>
```

## 6) MainActivity (WebView wrapper)

`app/src/main/java/com/amiro/news/MainActivity.kt`

```kotlin
package com.amiro.news

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Bundle
import android.view.KeyEvent
import android.view.View
import android.webkit.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progress: View
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    private val pickFile = registerForActivityResult(ActivityResultContracts.GetMultipleContents()) { uris ->
        filePathCallback?.onReceiveValue(uris?.toTypedArray() ?: emptyArray())
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progress = findViewById(R.id.progressBar)

        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            loadsImagesAutomatically = true
            allowFileAccess = true
            mediaPlaybackRequiresUserGesture = false
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString = userAgentString + " AmiroNewsApp/1.0"
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                progress.visibility = if (newProgress in 1..99) View.VISIBLE else View.GONE
            }
            override fun onShowFileChooser(
                webView: WebView?, filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback = filePathCallback
                pickFile.launch("*/*")
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                // Open external links in browser
                return if (!url.contains("amironews.com")) {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } else false
            }
            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                progress.visibility = View.VISIBLE
            }
            override fun onPageFinished(view: WebView?, url: String?) {
                progress.visibility = View.GONE
            }
        }

        if (savedInstanceState == null) {
            webView.loadUrl("https://www.amironews.com/")
        }
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack(); return true
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView.restoreState(savedInstanceState)
    }
}
```

## 7) Run

* Plug in a device or start an emulator → **Run ▶** in Android Studio.

---

# iOS (Swift + SwiftUI) — open in Xcode (Swift)

## 1) Create project

1. Xcode → *Create a new project* → **App**
2. Product Name: `AmiroNews`
3. Interface: **SwiftUI**; Language: **Swift**
4. Bundle ID: `com.amiro.news`
5. Minimum iOS: **15.0** (or as you prefer)

## 2) Info.plist

Add:

* **App Transport Security Settings → Allow Arbitrary Loads = NO** (default)
* **NSAppTransportSecurity / NSAllowsArbitraryLoadsInWebContent = YES** *(if any mixed content appears; start with NO if site is fully HTTPS)*
* **Privacy – Camera/Microphone/Photo Library Usage Description** (optional, if uploads)

Example (key/value style):

```
Privacy - Camera Usage Description : Camera access for uploads
Privacy - Microphone Usage Description : Mic access for audio uploads
Privacy - Photo Library Usage Description : Photo library access for uploads
```

## 3) WebView wrapper

Create `WebView.swift`:

```swift
import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.allowsInlineMediaPlayback = true
        config.defaultWebpagePreferences.preferredContentMode = .mobile

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.customUserAgent = (WKWebView().value(forKey: "userAgent") as? String ?? "") + " AmiroNewsApp/1.0"
        webView.scrollView.bounces = true

        let request = URLRequest(url: url, cachePolicy: .useProtocolCachePolicy, timeoutInterval: 30)
        webView.load(request)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator() }

    class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            if let host = navigationAction.request.url?.host,
               !host.contains("amironews.com") {
                UIApplication.shared.open(navigationAction.request.url!, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
                return
            }
            decisionHandler(.allow)
        }

        // target="_blank" support
        func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                     for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
            if let url = navigationAction.request.url {
                webView.load(URLRequest(url: url))
            }
            return nil
        }
    }
}
```

## 4) App entry (SwiftUI)

Replace `AmiroNewsApp.swift` content with:

```swift
import SwiftUI

@main
struct AmiroNewsApp: App {
    var body: some Scene {
        WindowGroup {
            WebView(url: URL(string: "https://www.amironews.com/")!)
                .ignoresSafeArea(.all)
        }
    }
}
```

## 5) Run

* Select a simulator or device → **Run ▶** in Xcode.

---

## Optional polish (both platforms)

* **Splash & Icons**: use your logo; Android via `mipmap-*` and a `drawable/launch_background.xml`; iOS via Asset Catalog + Launch Screen storyboard.
* **Pull-to-refresh**: Android via `SwipeRefreshLayout`, iOS via `UIRefreshControl` on `webView.scrollView`.
* **Deep Links / App Links**:

  * Android: already in `Manifest`; add Digital Asset Links at `https://amironews.com/.well-known/assetlinks.json`.
  * iOS: set up **Associated Domains** with `applinks:amironews.com` and host `apple-app-site-association`.

`assetlinks.json` template:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.amiro.news",
      "sha256_cert_fingerprints": ["PASTE_YOUR_RELEASE_KEY_SHA256"]
    }
  }
]
```

**Get SHA-256** (Android Studio Terminal):

```bash
./gradlew signingReport
```

---

## Release builds (quick)

**Android**

```bash
# In Android Studio: Build > Generate Signed App Bundle / APK
# or CLI:
./gradlew bundleRelease
```

Upload the `app-release.aab` to Play Console.

**iOS**

* Xcode → *Any iOS Device (arm64)* → **Product > Archive** → Distribute via App Store Connect.
