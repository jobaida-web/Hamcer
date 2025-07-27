import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { auth, db } from '../firebase'
import { 
  collection, 
  query,
  where,
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  orderBy
} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'

function Dashboard() {
  const [user] = useAuthState(auth)
  const [activeTab, setActiveTab] = useState('overview')
  const [services, setServices] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeServices: 0,
    completedOrders: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    if (!user) return

    // Fetch user's services
    const servicesQuery = query(
      collection(db, 'services'),
      where('sellerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeServices = onSnapshot(servicesQuery, (snapshot) => {
      const servicesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setServices(servicesData)
      setStats(prev => ({ ...prev, activeServices: servicesData.length }))
    }, (error) => {
      console.error('Error fetching services:', error)
      setServices([])
    })

    // Fetch user's orders (both as buyer and seller)
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).filter(order => order.sellerId === user.uid || order.buyerId === user.uid)
      
      setOrders(ordersData)
      
      // Calculate stats
      const completed = ordersData.filter(order => order.status === 'completed')
      const pending = ordersData.filter(order => order.status === 'pending' || order.status === 'in-progress')
      const earnings = completed
        .filter(order => order.sellerId === user.uid)
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0)

      setStats(prev => ({
        ...prev,
        completedOrders: completed.length,
        pendingOrders: pending.length,
        totalEarnings: earnings
      }))
      
      setLoading(false)
    }, (error) => {
      console.error('Error fetching orders:', error)
      setOrders([])
      setLoading(false)
    })

    return () => {
      unsubscribeServices()
      unsubscribeOrders()
    }
  }, [user])

  const deleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteDoc(doc(db, 'services', serviceId))
        alert('Service deleted successfully!')
      } catch (error) {
        console.error('Error deleting service:', error)
        alert('Error deleting service. Please try again.')
      }
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      })
      alert('Order status updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order status. Please try again.')
    }
  }

  if (!user) {
    return <div>Please login to access your dashboard.</div>
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.displayName || user.email}!</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>${stats.totalEarnings}</h3>
              <p>Total Earnings</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛍️</div>
            <div className="stat-content">
              <h3>{stats.activeServices}</h3>
              <p>Active Services</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.completedOrders}</h3>
              <p>Completed Orders</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            My Services
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <Link to="/create-service" className="btn btn-primary">
                    Create New Service
                  </Link>
                  <Link to="/profile" className="btn btn-secondary">
                    Update Profile
                  </Link>
                  <Link to="/services" className="btn btn-outline">
                    Browse Services
                  </Link>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                {orders.slice(0, 5).length > 0 ? (
                  <div className="activity-list">
                    {orders.slice(0, 5).map(order => (
                      <div key={order.id} className="activity-item">
                        <div className="activity-icon">
                          {order.status === 'completed' ? '✅' : 
                           order.status === 'in-progress' ? '🔄' : '⏳'}
                        </div>
                        <div className="activity-content">
                          <p>
                            {order.sellerId === user.uid ? 'Order received' : 'Order placed'}: 
                            {order.packageDetails?.name || 'Service order'}
                          </p>
                          <small>{new Date(order.createdAt?.toDate()).toLocaleDateString()}</small>
                        </div>
                        <div className="activity-amount">
                          ${order.totalAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent activity. Start by creating your first service!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-tab">
              <div className="tab-header">
                <h2>My Services</h2>
                <Link to="/create-service" className="btn btn-primary">
                  Create New Service
                </Link>
              </div>

              {services.length > 0 ? (
                <div className="services-list">
                  {services.map(service => (
                    <div key={service.id} className="service-item">
                      <div className="service-info">
                        <h3>{service.title}</h3>
                        <p>{service.description.substring(0, 100)}...</p>
                        <div className="service-meta">
                          <span className="category">{service.category}</span>
                          <span className="price">From ${service.packages?.basic?.price}</span>
                          <span className={`status ${service.status}`}>{service.status}</span>
                        </div>
                      </div>
                      <div className="service-actions">
                        <Link to={`/service/${service.id}`} className="btn btn-sm btn-outline">
                          View
                        </Link>
                        <button 
                          onClick={() => deleteService(service.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No services yet</h3>
                  <p>Create your first service to start earning!</p>
                  <Link to="/create-service" className="btn btn-primary">
                    Create Service
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab">
              <h2>Orders</h2>

              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-item">
                      <div className="order-info">
                        <h3>{order.packageDetails?.name || 'Service Order'}</h3>
                        <p>
                          {order.sellerId === user.uid ? 'Buyer' : 'Seller'}: 
                          {order.sellerId === user.uid ? order.buyerEmail : order.sellerEmail}
                        </p>
                        <div className="order-meta">
                          <span className="order-date">
                            {new Date(order.createdAt?.toDate()).toLocaleDateString()}
                          </span>
                          <span className="order-amount">${order.totalAmount}</span>
                          <span className={`order-status ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      {order.sellerId === user.uid && order.status === 'pending' && (
                        <div className="order-actions">
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'in-progress')}
                            className="btn btn-sm btn-primary"
                          >
                            Accept Order
                          </button>
                        </div>
                      )}
                      
                      {order.sellerId === user.uid && order.status === 'in-progress' && (
                        <div className="order-actions">
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="btn btn-sm btn-success"
                          >
                            Mark Complete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No orders yet</h3>
                  <p>Orders will appear here when customers purchase your services.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard