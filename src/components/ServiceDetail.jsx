import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc, collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

function ServiceDetail() {
  const { id } = useParams()
  const [user] = useAuthState(auth)
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState('basic')
  const [orderLoading, setOrderLoading] = useState(false)

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
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const serviceDoc = await getDoc(doc(db, 'services', id))
      if (serviceDoc.exists()) {
        setService({ id: serviceDoc.id, ...serviceDoc.data() })
      } else {
        setService(null) // Service not found
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      setService(null)
    } finally {
      setLoading(false)
    }
  }

  const handleOrder = async () => {
    if (!user) {
      alert('Please login to place an order')
      return
    }

    setOrderLoading(true)
    try {
      const orderData = {
        serviceId: service.id,
        sellerId: service.sellerId || 'demo-seller',
        buyerId: user.uid,
        package: selectedPackage,
        packageDetails: service.packages[selectedPackage],
        status: 'pending',
        createdAt: new Date(),
        totalAmount: service.packages[selectedPackage].price
      }

      await addDoc(collection(db, 'orders'), orderData)
      alert('Order placed successfully! Check your dashboard for updates.')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Error placing order. Please try again.')
    } finally {
      setOrderLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading service...</p>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="error">
        <div className="container">
          <h2>Service not found</h2>
          <p>The service you're looking for doesn't exist or has been removed.</p>
          <Link to="/services" className="btn btn-primary">← Back to Services</Link>
        </div>
      </div>
    )
  }

  const currentPackage = service.packages?.[selectedPackage]
  
  if (!currentPackage) {
    return (
      <div className="error">
        <div className="container">
          <h2>Service data incomplete</h2>
          <p>This service doesn't have proper package information.</p>
          <Link to="/services" className="btn btn-primary">← Back to Services</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="service-detail">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/services">Services</Link> / <span>{service.title}</span>
        </div>

        <div className="service-layout">
          <div className="service-main">
            <div className="service-gallery">
              <div className="gallery-main">
                <span className="gallery-icon">{getCategoryIcon(service.category)}</span>
              </div>
              <div className="gallery-thumbs">
                <span className="gallery-thumb">{getCategoryIcon(service.category)}</span>
                <span className="gallery-thumb">📊</span>
                <span className="gallery-thumb">📈</span>
                <span className="gallery-thumb">🔬</span>
              </div>
            </div>

            <div className="service-info">
              <div className="seller-info">
                <span className="seller-avatar">{service.sellerAvatar || '👤'}</span>
                <div className="seller-details">
                  <h4>{service.sellerName || 'Anonymous Seller'}</h4>
                  <span className={`seller-level ${(service.sellerLevel || 'new').toLowerCase().replace(' ', '-')}`}>
                    {service.sellerLevel || 'New Seller'}
                  </span>
                  <div className="seller-rating">
                    <span className="rating-stars">⭐</span>
                    <span>{service.rating || 0}</span>
                    <span>({service.reviewCount || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <h1>{service.title}</h1>
              <p className="service-description">{service.description}</p>

              <div className="service-tabs">
                <div className="tab-content">
                  <div className="seller-about">
                    <h3>About the Seller</h3>
                    <p>{service.sellerBio || 'No bio available for this seller.'}</p>
                    <div className="seller-stats">
                      <div className="stat">
                        <strong>Member since:</strong> {service.createdAt ? new Date(service.createdAt.toDate()).toLocaleDateString() : 'Recently joined'}
                      </div>
                      <div className="stat">
                        <strong>Response time:</strong> {service.responseTime || 'Within 24 hours'}
                      </div>
                    </div>
                  </div>

                  {service.faq && service.faq.length > 0 && (
                    <div className="service-faq">
                      <h3>Frequently Asked Questions</h3>
                      {service.faq.map((item, index) => (
                        <div key={index} className="faq-item">
                          <h4>{item.question}</h4>
                          <p>{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="service-reviews">
                    <h3>Reviews ({service.reviews?.length || 0})</h3>
                    {service.reviews && service.reviews.length > 0 ? (
                      service.reviews.map(review => (
                        <div key={review.id} className="review">
                          <div className="review-header">
                            <strong>{review.user}</strong>
                            <div className="review-rating">
                              <span className="rating-stars">⭐</span>
                              <span>{review.rating}</span>
                            </div>
                            <span className="review-date">{review.date}</span>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet. Be the first to review this service!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="service-sidebar">
            <div className="package-selector">
              <div className="package-tabs">
                {Object.keys(service.packages).map(packageType => (
                  <button
                    key={packageType}
                    className={`package-tab ${selectedPackage === packageType ? 'active' : ''}`}
                    onClick={() => setSelectedPackage(packageType)}
                  >
                    {service.packages[packageType].name}
                  </button>
                ))}
              </div>

              <div className="package-details">
                <div className="package-header">
                  <h3>{currentPackage.name}</h3>
                  <div className="package-price">${currentPackage.price}</div>
                </div>

                <div className="package-delivery">
                  <span className="delivery-icon">🚚</span>
                  <span>{currentPackage.deliveryTime} delivery</span>
                </div>

                <ul className="package-features">
                  {currentPackage.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  className="order-button"
                  onClick={handleOrder}
                  disabled={orderLoading}
                >
                  {orderLoading ? 'Processing...' : `Continue ($${currentPackage.price})`}
                </button>

                <div className="contact-seller">
                  <button className="contact-button">Contact Seller</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail