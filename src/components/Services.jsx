import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '../firebase'

function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState('all')

  const categories = [
    'Research Papers',
    'Health Articles', 
    'Medical Journals',
    'Public Health',
    'Content Writing',
    'Blog Writing'
  ]

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const servicesRef = collection(db, 'services')
      const q = query(servicesRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      setServices(servicesData)
    } catch (error) {
      console.error('Error fetching services:', error)
      // Add some sample data for demo
      setServices([
        {
          id: '1',
          title: 'Professional Medical Research Paper Writing',
          description: 'I will write comprehensive medical research papers with proper citations and methodology.',
          category: 'Research Papers',
          price: 150,
          deliveryTime: '7 days',
          rating: 4.9,
          reviewCount: 127,
          seller: {
            name: 'Dr. Sarah Johnson',
            avatar: '👩‍⚕️',
            level: 'Top Rated'
          },
          image: '📄'
        },
        {
          id: '2',
          title: 'Public Health Article Writing & Analysis',
          description: 'Expert public health content creation with evidence-based research and analysis.',
          category: 'Public Health',
          price: 85,
          deliveryTime: '3 days',
          rating: 4.8,
          reviewCount: 89,
          seller: {
            name: 'Prof. Michael Chen',
            avatar: '👨‍🎓',
            level: 'Level 2'
          },
          image: '🌍'
        },
        {
          id: '3',
          title: 'Medical Journal Article Submission Ready',
          description: 'I will create publication-ready medical journal articles with proper formatting.',
          category: 'Medical Journals',
          price: 200,
          deliveryTime: '10 days',
          rating: 5.0,
          reviewCount: 45,
          seller: {
            name: 'Dr. Emily Rodriguez',
            avatar: '👩‍🔬',
            level: 'Top Rated'
          },
          image: '📚'
        },
        {
          id: '4',
          title: 'Health & Wellness Blog Content Creation',
          description: 'Engaging health blog posts that educate and inform your audience.',
          category: 'Blog Writing',
          price: 45,
          deliveryTime: '2 days',
          rating: 4.7,
          reviewCount: 203,
          seller: {
            name: 'Lisa Thompson',
            avatar: '✍️',
            level: 'Level 1'
          },
          image: '📝'
        },
        {
          id: '5',
          title: 'Healthcare Content Writing & SEO',
          description: 'SEO-optimized healthcare content that ranks well and provides value.',
          category: 'Content Writing',
          price: 65,
          deliveryTime: '3 days',
          rating: 4.6,
          reviewCount: 156,
          seller: {
            name: 'James Wilson',
            avatar: '📊',
            level: 'Level 2'
          },
          image: '✍️'
        },
        {
          id: '6',
          title: 'Clinical Research Paper Analysis',
          description: 'Detailed analysis and writing of clinical research papers with statistical review.',
          category: 'Research Papers',
          price: 180,
          deliveryTime: '8 days',
          rating: 4.9,
          reviewCount: 78,
          seller: {
            name: 'Dr. Robert Kim',
            avatar: '🔬',
            level: 'Top Rated'
          },
          image: '📄'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under50' && service.price < 50) ||
                        (priceRange === '50-100' && service.price >= 50 && service.price <= 100) ||
                        (priceRange === '100-200' && service.price > 100 && service.price <= 200) ||
                        (priceRange === 'over200' && service.price > 200)
    
    return matchesSearch && matchesCategory && matchesPrice
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading services...</p>
      </div>
    )
  }

  return (
    <div className="services">
      <div className="services-header">
        <div className="container">
          <h1>Health Science Writing Services</h1>
          <p>Find expert writers for your health science content needs</p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Prices</option>
              <option value="under50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="over200">Over $200</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="services-results">
          <p className="results-count">
            {filteredServices.length} services found
          </p>

          <div className="services-grid">
            {filteredServices.map(service => (
              <Link to={`/service/${service.id}`} key={service.id} className="service-card">
                <div className="service-image">
                  <span className="service-icon">{service.image}</span>
                </div>
                
                <div className="service-content">
                  <div className="service-seller">
                    <span className="seller-avatar">{service.seller.avatar}</span>
                    <span className="seller-name">{service.seller.name}</span>
                    <span className={`seller-level ${service.seller.level.toLowerCase().replace(' ', '-')}`}>
                      {service.seller.level}
                    </span>
                  </div>

                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-meta">
                    <div className="service-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{service.rating}</span>
                      <span className="rating-count">({service.reviewCount})</span>
                    </div>
                    <span className="service-category">{service.category}</span>
                  </div>

                  <div className="service-footer">
                    <div className="service-delivery">
                      <span className="delivery-icon">🚚</span>
                      <span>{service.deliveryTime}</span>
                    </div>
                    <div className="service-price">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">${service.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="no-results">
              <h3>No services found</h3>
              <p>Try adjusting your search criteria or browse all categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Services