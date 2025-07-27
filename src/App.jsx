import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { auth } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Home from './components/Home'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Services from './components/Services'
import ServiceDetail from './components/ServiceDetail'
import Profile from './components/Profile'
import CreateService from './components/CreateService'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Hamcer
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/services" className="nav-link">
                Browse Services
              </Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/create-service" className="nav-link">
                    Sell Services
                  </Link>
                  <Link to="/profile" className="nav-link">
                    Profile
                  </Link>
                  <button onClick={handleSignOut} className="nav-button">
                    Sign Out
                  </button>
                  <span className="user-info">
                    Welcome, {user.displayName || user.email}
                  </span>
                </>
              ) : (
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Login />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Login />} 
            />
            <Route 
              path="/create-service" 
              element={user ? <CreateService /> : <Login />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App