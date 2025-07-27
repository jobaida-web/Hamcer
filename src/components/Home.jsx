import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="home">
      <h1>Welcome to Hamcer</h1>
      <div className="card">
        <h2>Modern Web Application</h2>
        <p>
          This is a modern web application built with React and Firebase.
          It includes authentication, real-time database, and cloud storage capabilities.
        </p>
        
        <div className="demo-section">
          <h3>Interactive Demo</h3>
          <button onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
          <p>
            Click the button above to see React state management in action!
          </p>
        </div>

        <div className="features">
          <h3>Features</h3>
          <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
            <li>🔐 Firebase Authentication</li>
            <li>🗄️ Cloud Firestore Database</li>
            <li>☁️ Cloud Storage</li>
            <li>⚡ Vite for fast development</li>
            <li>🎨 Modern React with Hooks</li>
            <li>🛣️ React Router for navigation</li>
            <li>📱 Responsive design</li>
          </ul>
        </div>

        <div className="getting-started">
          <h3>Getting Started</h3>
          <p>
            To get started, you'll need to configure Firebase:
          </p>
          <ol style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <li>Create a Firebase project at <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
            <li>Enable Authentication, Firestore, and Storage</li>
            <li>Update the Firebase configuration in <code>src/firebase.js</code></li>
            <li>Deploy your app using Firebase Hosting</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Home