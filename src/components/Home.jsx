import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Home() {
  const [stats, setStats] = useState({
    services: 1250,
    freelancers: 850,
    completed: 3200
  })

  const categories = [
    { name: 'Research Papers', icon: '📄', count: 320 },
    { name: 'Health Articles', icon: '🏥', count: 450 },
    { name: 'Medical Journals', icon: '📚', count: 180 },
    { name: 'Public Health', icon: '🌍', count: 290 },
    { name: 'Content Writing', icon: '✍️', count: 380 },
    { name: 'Blog Writing', icon: '📝', count: 520 }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Expert Health Science Writers</h1>
          <p className="hero-subtitle">
            Connect with professional writers specializing in public health, medical research, 
            journals, and health science content. Get quality work delivered on time.
          </p>
          <div className="hero-buttons">
            <Link to="/services" className="btn btn-primary">
              Browse Services
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Start Selling
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{stats.services.toLocaleString()}+</span>
              <span className="stat-label">Services Available</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.freelancers.toLocaleString()}+</span>
              <span className="stat-label">Expert Writers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.completed.toLocaleString()}+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Popular Health Science Categories</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link to="/services" key={index} className="category-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.count} services available</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How Hamcer Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Services</h3>
              <p>Explore thousands of health science writing services from expert freelancers</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Your Writer</h3>
              <p>Review profiles, portfolios, and ratings to find the perfect match</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Quality Work</h3>
              <p>Receive professional, well-researched content delivered on time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Hamcer?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Expert Writers</h3>
              <p>Qualified professionals with expertise in health sciences and medical writing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast Delivery</h3>
              <p>Get your projects completed quickly without compromising on quality</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Platform</h3>
              <p>Safe payments and secure communication through our protected platform</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Quality Guarantee</h3>
              <p>Satisfaction guaranteed with unlimited revisions until you're happy</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied clients who trust Hamcer for their health science content needs</p>
          <div className="cta-buttons">
            <Link to="/services" className="btn btn-primary">
              Find Services
            </Link>
            <Link to="/login" className="btn btn-outline">
              Become a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home