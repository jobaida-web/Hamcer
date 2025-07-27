import { useState, useEffect } from 'react'
import { auth, db, storage } from '../firebase'
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

function Dashboard() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    if (!auth.currentUser) return

    const unsubscribe = onSnapshot(
      collection(db, 'items'),
      (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(itemsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds))
      },
      (error) => {
        console.error('Error fetching items:', error)
      }
    )

    return () => unsubscribe()
  }, [])

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return

    setLoading(true)
    try {
      await addDoc(collection(db, 'items'), {
        text: newItem,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        completed: false
      })
      setNewItem('')
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id))
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const toggleComplete = async (id, completed) => {
    try {
      await updateDoc(doc(db, 'items', id), {
        completed: !completed
      })
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploadProgress('Uploading...')
    try {
      const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${file.name}`)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      await addDoc(collection(db, 'items'), {
        text: `File uploaded: ${file.name}`,
        fileUrl: downloadURL,
        fileName: file.name,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
        completed: false
      })
      
      setFile(null)
      setUploadProgress('Upload successful!')
      setTimeout(() => setUploadProgress(''), 3000)
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploadProgress('Upload failed!')
      setTimeout(() => setUploadProgress(''), 3000)
    }
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome, {auth.currentUser?.email}!</p>

      <div className="card">
        <h3>Add New Item</h3>
        <form onSubmit={addItem}>
          <div className="form-group">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter a new item..."
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn" disabled={loading || !newItem.trim()}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>File Upload</h3>
        <form onSubmit={handleFileUpload}>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
          </div>
          <button type="submit" className="btn" disabled={!file}>
            Upload File
          </button>
          {uploadProgress && (
            <div className={uploadProgress.includes('successful') ? 'success' : uploadProgress.includes('failed') ? 'error' : ''}>
              {uploadProgress}
            </div>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Your Items ({items.length})</h3>
        {items.length === 0 ? (
          <p>No items yet. Add some items above!</p>
        ) : (
          <div className="items-list">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="item"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  backgroundColor: item.completed ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  textDecoration: item.completed ? 'line-through' : 'none'
                }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <p style={{ margin: '0 0 0.5rem 0' }}>{item.text}</p>
                  {item.fileUrl && (
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.8rem', color: '#646cff' }}
                    >
                      📎 {item.fileName}
                    </a>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                    {item.createdAt?.toDate?.()?.toLocaleString() || 'Just now'}
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => toggleComplete(item.id, item.completed)}
                    className="btn"
                    style={{ 
                      marginRight: '0.5rem',
                      backgroundColor: item.completed ? '#51cf66' : '#ffd43b',
                      color: '#000'
                    }}
                  >
                    {item.completed ? '✓' : '○'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="btn"
                    style={{ backgroundColor: '#ff6b6b' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Firebase Services Status</h3>
        <div style={{ textAlign: 'left' }}>
          <p>✅ Authentication: Connected ({auth.currentUser?.email})</p>
          <p>🔄 Firestore: {items.length > 0 ? 'Connected' : 'Waiting for data...'}</p>
          <p>☁️ Storage: Ready for file uploads</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard