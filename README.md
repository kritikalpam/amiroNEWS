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
