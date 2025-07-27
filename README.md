# Hamcer

A modern web application built with React, Vite, and Firebase. This application provides a complete full-stack solution with authentication, real-time database, and cloud storage capabilities.

## Features

- 🔐 **Firebase Authentication** - Email/password and Google sign-in
- 🗄️ **Cloud Firestore** - Real-time NoSQL database
- ☁️ **Cloud Storage** - File upload and management
- ⚡ **Vite** - Fast development and build tool
- 🎨 **Modern React** - Hooks, functional components, and React Router
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔄 **Real-time Updates** - Live data synchronization

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Hamcer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication, Firestore, and Storage
   - Get your Firebase config from Project Settings
   - Update `src/firebase.js` with your configuration

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:12000`

## Firebase Configuration

Update the `firebaseConfig` object in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Firebase Services Setup

### Authentication
1. Go to Firebase Console > Authentication
2. Enable Email/Password provider
3. Enable Google provider (optional)

### Firestore Database
1. Go to Firebase Console > Firestore Database
2. Create database in test mode
3. Deploy security rules: `firebase deploy --only firestore:rules`

### Cloud Storage
1. Go to Firebase Console > Storage
2. Set up Cloud Storage
3. Deploy storage rules: `firebase deploy --only storage`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**
   ```bash
   firebase init
   ```

4. **Build and deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## Project Structure

```
Hamcer/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── firebase.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
├── vite.config.js
└── README.md
```

## Usage

### Authentication
- Users can sign up/sign in with email and password
- Google authentication is supported
- Protected routes require authentication

### Dashboard Features
- Add and manage items
- Upload files to Cloud Storage
- Real-time data synchronization
- Mark items as complete/incomplete

## Security

The application includes proper security rules for:
- **Firestore**: Users can only access their own data
- **Storage**: Users can only upload to their own folders
- **Authentication**: Proper user session management

## Development

### Environment Setup
The application is configured to work with the provided development ports:
- Development server: Port 12000
- Preview server: Port 12001
- CORS and iframe support enabled

### Code Quality
- ESLint configuration included
- Modern React patterns and hooks
- Clean, maintainable code structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support and questions:
- Check the Firebase documentation
- Review the React and Vite documentation
- Open an issue in the repository