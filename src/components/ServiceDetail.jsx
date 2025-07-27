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

  useEffect(() => {
    fetchService()
  }, [id])

  const fetchService = async () => {
    try {
      const serviceDoc = await getDoc(doc(db, 'services', id))
      if (serviceDoc.exists()) {
        setService({ id: serviceDoc.id, ...serviceDoc.data() })
      } else {
        // Demo data for the service
        setService({
          id: id,
          title: 'Professional Medical Research Paper Writing',
          description: 'I will write comprehensive medical research papers with proper citations and methodology. With over 10 years of experience in medical research and academic writing, I provide high-quality, well-researched papers that meet academic standards.',
          category: 'Research Papers',
          seller: {
            name: 'Dr. Sarah Johnson',
            avatar: '👩‍⚕️',
            level: 'Top Rated',
            rating: 4.9,
            reviewCount: 127,
            memberSince: 'March 2020',
            responseTime: '1 hour',
            bio: 'Medical researcher and academic writer with PhD in Public Health. Specialized in epidemiology, health policy, and clinical research methodology.'
          },
          packages: {
            basic: {
              name: 'Basic Research Paper',
              price: 150,
              deliveryTime: '7 days',
              features: [
                '5-10 pages research paper',
                'Basic literature review',
                '10+ academic references',
                '1 revision included',
                'APA/MLA formatting'
              ]
            },
            standard: {
              name: 'Standard Research Paper',
              price: 250,
              deliveryTime: '10 days',
              features: [
                '10-20 pages research paper',
                'Comprehensive literature review',
                '20+ academic references',
                '3 revisions included',
                'APA/MLA formatting',
                'Statistical analysis',
                'Abstract and keywords'
              ]
            },
            premium: {
              name: 'Premium Research Paper',
              price: 400,
              deliveryTime: '14 days',
              features: [
                '20+ pages research paper',
                'Extensive literature review',
                '30+ academic references',
                'Unlimited revisions',
                'APA/MLA formatting',
                'Advanced statistical analysis',
                'Abstract and keywords',
                'Publication consultation',
                'Plagiarism report'
              ]
            }
          },
          gallery: ['📄', '📊', '📈', '🔬'],
          reviews: [
            {
              id: 1,
              user: 'Dr. Michael Brown',
              rating: 5,
              comment: 'Exceptional work! The research paper was well-structured and thoroughly researched. Highly recommend!',
              date: '2 weeks ago'
            },
            {
              id: 2,
              user: 'Prof. Lisa Chen',
              rating: 5,
              comment: 'Outstanding quality and delivered on time. Will definitely work with Dr. Johnson again.',
              date: '1 month ago'
            },
            {
              id: 3,
              user: 'Research Student',
              rating: 4,
              comment: 'Great work overall. Very professional and responsive to feedback.',
              date: '2 months ago'
            }
          ],
          faq: [
            {
              question: 'What citation style do you use?',
              answer: 'I can work with any citation style including APA, MLA, Chicago, Harvard, and Vancouver. Please specify your preferred style when placing the order.'
            },
            {
              question: 'Do you provide plagiarism reports?',
              answer: 'Yes, I provide plagiarism reports with the Premium package. For Basic and Standard packages, it can be added for an additional $15.'
            },
            {
              question: 'Can you help with journal submission?',
              answer: 'Absolutely! I can help format your paper according to specific journal requirements and provide guidance on the submission process.'
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error fetching service:', error)
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
        <h2>Service not found</h2>
        <Link to="/services">← Back to Services</Link>
      </div>
    )
  }

  const currentPackage = service.packages[selectedPackage]

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
                <span className="gallery-icon">{service.gallery?.[0] || '📄'}</span>
              </div>
              <div className="gallery-thumbs">
                {service.gallery?.map((icon, index) => (
                  <span key={index} className="gallery-thumb">{icon}</span>
                ))}
              </div>
            </div>

            <div className="service-info">
              <div className="seller-info">
                <span className="seller-avatar">{service.seller.avatar}</span>
                <div className="seller-details">
                  <h4>{service.seller.name}</h4>
                  <span className={`seller-level ${service.seller.level.toLowerCase().replace(' ', '-')}`}>
                    {service.seller.level}
                  </span>
                  <div className="seller-rating">
                    <span className="rating-stars">⭐</span>
                    <span>{service.seller.rating}</span>
                    <span>({service.seller.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <h1>{service.title}</h1>
              <p className="service-description">{service.description}</p>

              <div className="service-tabs">
                <div className="tab-content">
                  <div className="seller-about">
                    <h3>About the Seller</h3>
                    <p>{service.seller.bio}</p>
                    <div className="seller-stats">
                      <div className="stat">
                        <strong>Member since:</strong> {service.seller.memberSince}
                      </div>
                      <div className="stat">
                        <strong>Response time:</strong> {service.seller.responseTime}
                      </div>
                    </div>
                  </div>

                  <div className="service-faq">
                    <h3>Frequently Asked Questions</h3>
                    {service.faq.map((item, index) => (
                      <div key={index} className="faq-item">
                        <h4>{item.question}</h4>
                        <p>{item.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="service-reviews">
                    <h3>Reviews ({service.reviews.length})</h3>
                    {service.reviews.map(review => (
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
                    ))}
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