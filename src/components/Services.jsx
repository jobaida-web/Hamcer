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

  const getCategoryIcon = (category) => {
    const icons = {
      'Research Papers': '📄',
      'Health Articles': '🏥',
      'Medical Journals': '📚',
      'Public Health': '🌍',
      'Content Writing': '✍️',
      'Blog Writing': '📝'
    }
    return icons[category] || '📄'
  }

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
      setServices([]) // Set empty array if error occurs
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    
    // Get the basic package price for filtering
    const basicPrice = service.packages?.basic?.price || 0
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'under50' && basicPrice < 50) ||
                        (priceRange === '50-100' && basicPrice >= 50 && basicPrice <= 100) ||
                        (priceRange === '100-200' && basicPrice > 100 && basicPrice <= 200) ||
                        (priceRange === 'over200' && basicPrice > 200)
    
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
                  <span className="service-icon">{getCategoryIcon(service.category)}</span>
                </div>
                
                <div className="service-content">
                  <div className="service-seller">
                    <span className="seller-avatar">{service.sellerAvatar || '👤'}</span>
                    <span className="seller-name">{service.sellerName || 'Anonymous'}</span>
                    <span className={`seller-level ${(service.sellerLevel || 'new').toLowerCase().replace(' ', '-')}`}>
                      {service.sellerLevel || 'New'}
                    </span>
                  </div>

                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description?.substring(0, 100)}...</p>
                  
                  <div className="service-meta">
                    <div className="service-rating">
                      <span className="rating-stars">⭐</span>
                      <span className="rating-value">{service.rating || 0}</span>
                      <span className="rating-count">({service.reviewCount || 0})</span>
                    </div>
                    <span className="service-category">{service.category}</span>
                  </div>

                  <div className="service-footer">
                    <div className="service-delivery">
                      <span className="delivery-icon">🚚</span>
                      <span>{service.packages?.basic?.deliveryTime || 'TBD'}</span>
                    </div>
                    <div className="service-price">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">${service.packages?.basic?.price || 0}</span>
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