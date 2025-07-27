import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'

function CreateService() {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Research Papers',
    tags: '',
    basicPrice: '',
    basicDelivery: '3',
    basicFeatures: '',
    standardPrice: '',
    standardDelivery: '5',
    standardFeatures: '',
    premiumPrice: '',
    premiumDelivery: '7',
    premiumFeatures: ''
  })

  const categories = [
    'Research Papers',
    'Health Articles',
    'Medical Journals',
    'Public Health',
    'Content Writing',
    'Blog Writing'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to create a service')
      return
    }

    setLoading(true)
    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
        sellerEmail: user.email,
        packages: {
          basic: {
            name: 'Basic Package',
            price: parseInt(formData.basicPrice),
            deliveryTime: `${formData.basicDelivery} days`,
            features: formData.basicFeatures.split('\n').filter(f => f.trim())
          },
          standard: {
            name: 'Standard Package',
            price: parseInt(formData.standardPrice),
            deliveryTime: `${formData.standardDelivery} days`,
            features: formData.standardFeatures.split('\n').filter(f => f.trim())
          },
          premium: {
            name: 'Premium Package',
            price: parseInt(formData.premiumPrice),
            deliveryTime: `${formData.premiumDelivery} days`,
            features: formData.premiumFeatures.split('\n').filter(f => f.trim())
          }
        },
        status: 'active',
        createdAt: new Date(),
        rating: 0,
        reviewCount: 0
      }

      const docRef = await addDoc(collection(db, 'services'), serviceData)
      alert('Service created successfully!')
      navigate(`/service/${docRef.id}`)
    } catch (error) {
      console.error('Error creating service:', error)
      alert('Error creating service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-service">
      <div className="container">
        <div className="create-service-header">
          <h1>Create a New Service</h1>
          <p>Share your expertise and start earning by offering your health science writing services</p>
        </div>

        <form onSubmit={handleSubmit} className="create-service-form">
          {/* Basic Information */}
          <div className="form-section">
            <h2>Service Overview</h2>
            
            <div className="form-group">
              <label htmlFor="title">Service Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="I will write a professional medical research paper"
                required
                maxLength="80"
              />
              <small>{formData.title.length}/80 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">Service Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service in detail. What will you deliver? What makes your service unique?"
                required
                rows="6"
                maxLength="1200"
              />
              <small>{formData.description.length}/1200 characters</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="medical writing, research, health, public health"
                />
                <small>Separate tags with commas</small>
              </div>
            </div>
          </div>

          {/* Pricing Packages */}
          <div className="form-section">
            <h2>Pricing & Packages</h2>
            <p>Create different packages to offer various levels of service</p>

            {/* Basic Package */}
            <div className="package-form">
              <h3>Basic Package</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="basicPrice">Price ($) *</label>
                  <input
                    type="number"
                    id="basicPrice"
                    name="basicPrice"
                    value={formData.basicPrice}
                    onChange={handleInputChange}
                    min="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="basicDelivery">Delivery Time (days) *</label>
                  <select
                    id="basicDelivery"
                    name="basicDelivery"
                    value={formData.basicDelivery}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                    <option value="14">14 days</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="basicFeatures">Features (one per line) *</label>
                <textarea
                  id="basicFeatures"
                  name="basicFeatures"
                  value={formData.basicFeatures}
                  onChange={handleInputChange}
                  placeholder="5-10 pages research paper&#10;Basic literature review&#10;10+ academic references&#10;1 revision included"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Standard Package */}
            <div className="package-form">
              <h3>Standard Package</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="standardPrice">Price ($) *</label>
                  <input
                    type="number"
                    id="standardPrice"
                    name="standardPrice"
                    value={formData.standardPrice}
                    onChange={handleInputChange}
                    min="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="standardDelivery">Delivery Time (days) *</label>
                  <select
                    id="standardDelivery"
                    name="standardDelivery"
                    value={formData.standardDelivery}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                    <option value="14">14 days</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="standardFeatures">Features (one per line) *</label>
                <textarea
                  id="standardFeatures"
                  name="standardFeatures"
                  value={formData.standardFeatures}
                  onChange={handleInputChange}
                  placeholder="10-20 pages research paper&#10;Comprehensive literature review&#10;20+ academic references&#10;3 revisions included&#10;Statistical analysis"
                  rows="4"
                  required
                />
              </div>
            </div>

            {/* Premium Package */}
            <div className="package-form">
              <h3>Premium Package</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="premiumPrice">Price ($) *</label>
                  <input
                    type="number"
                    id="premiumPrice"
                    name="premiumPrice"
                    value={formData.premiumPrice}
                    onChange={handleInputChange}
                    min="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="premiumDelivery">Delivery Time (days) *</label>
                  <select
                    id="premiumDelivery"
                    name="premiumDelivery"
                    value={formData.premiumDelivery}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="1">1 day</option>
                    <option value="2">2 days</option>
                    <option value="3">3 days</option>
                    <option value="5">5 days</option>
                    <option value="7">7 days</option>
                    <option value="10">10 days</option>
                    <option value="14">14 days</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="premiumFeatures">Features (one per line) *</label>
                <textarea
                  id="premiumFeatures"
                  name="premiumFeatures"
                  value={formData.premiumFeatures}
                  onChange={handleInputChange}
                  placeholder="20+ pages research paper&#10;Extensive literature review&#10;30+ academic references&#10;Unlimited revisions&#10;Advanced statistical analysis&#10;Publication consultation"
                  rows="5"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating Service...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateService