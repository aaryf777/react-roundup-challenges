# Firebase Google Authentication Setup

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication in your Firebase project

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Get Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Click on the web app icon (</>)
7. Register your app if you haven't already
8. Copy the config values from the provided configuration object

## Enable Google Authentication

1. In Firebase Console, go to "Authentication"
2. Click on "Sign-in method" tab
3. Click on "Google" provider
4. Enable it and configure:
   - Project support email
   - Authorized domains (add your domain)
5. Save the changes

## Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Firestore Security Rules

Update your Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Allow authenticated users to read challenges
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
    }

    // Allow authenticated users to create submissions
    match /submissions/{submissionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Features Implemented

✅ Firebase initialization with environment variables  
✅ Google authentication with modal  
✅ Automatic user state management  
✅ Persistent authentication state  
✅ Logout functionality  
✅ TypeScript support for environment variables  
✅ Firestore database integration  
✅ User data management  
✅ Challenge data management  
✅ Submission tracking  
✅ Leaderboard functionality  
✅ Real-time data synchronization

## Usage

The Google login is already integrated into:

- Login page (`/login`)
- Register page (`/register`)

Users can click the "Google" button to sign in with their Google account.

## Security Notes

- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore` file
- Use different Firebase projects for development and production
