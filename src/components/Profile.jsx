import { useState, useEffect } from 'react'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'

function Profile() {
  const [user] = useAuthState(auth)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    bio: '',
    skills: '',
    experience: '',
    education: '',
    languages: '',
    hourlyRate: '',
    availability: 'full-time'
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', user.uid))
      if (profileDoc.exists()) {
        setProfileData(profileDoc.data())
      } else {
        // Set default values from user
        setProfileData(prev => ({
          ...prev,
          displayName: user.displayName || '',
        }))
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileData.displayName
      })

      // Save profile data to Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profileData,
        userId: user.uid,
        email: user.email,
        updatedAt: new Date()
      })

      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Please login to view your profile.</div>
  }

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your professional profile and showcase your expertise</p>
        </div>

        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                <span className="avatar-placeholder">
                  {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3>{profileData.displayName || 'Your Name'}</h3>
              <p className="profile-email">{user.email}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Active Services</span>
                </div>
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Completed Orders</span>
                </div>
                <div className="stat">
                  <span className="stat-number">0</span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-main">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="displayName">Full Name *</label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    placeholder="Dr. Sarah Johnson"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Professional Bio *</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell clients about your background, expertise, and what makes you unique..."
                    rows="4"
                    maxLength="600"
                    required
                  />
                  <small>{profileData.bio.length}/600 characters</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                    <input
                      type="number"
                      id="hourlyRate"
                      name="hourlyRate"
                      value={profileData.hourlyRate}
                      onChange={handleInputChange}
                      placeholder="50"
                      min="5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      value={profileData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Evenings only</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Professional Details</h2>

                <div className="form-group">
                  <label htmlFor="skills">Skills & Expertise</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleInputChange}
                    placeholder="Medical writing, Research methodology, Statistical analysis, Public health, Epidemiology..."
                    rows="3"
                  />
                  <small>List your key skills separated by commas</small>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Professional Experience</label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant work experience, positions held, and achievements..."
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education & Certifications</label>
                  <textarea
                    id="education"
                    name="education"
                    value={profileData.education}
                    onChange={handleInputChange}
                    placeholder="PhD in Public Health, Harvard University (2015)&#10;Certified Medical Writer (AMWA)..."
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="languages">Languages</label>
                  <input
                    type="text"
                    id="languages"
                    name="languages"
                    value={profileData.languages}
                    onChange={handleInputChange}
                    placeholder="English (Native), Spanish (Fluent), French (Conversational)"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile