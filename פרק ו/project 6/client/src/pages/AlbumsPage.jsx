import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import PhotoSection from '../components/PhotoSection'

function AlbumsPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [albums, setAlbums] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchUserAlbums()
  }, [])

  const fetchUserAlbums = async () => {
    try {
      const { data } = await api.getAlbumsByUser(user.id)
      setAlbums(data)
    } catch (err) {
      console.error('שגיאה בקבלת האלבומים שלך:', err)
    }
  }

  const handleAddAlbum = async () => {
    if (!title) return

    try {
      const { data } = await api.createAlbum({ user_id: user.id, title })
      setAlbums([...albums, data])
      setTitle('')
    } catch (err) {
      console.error('שגיאה בהוספת אלבום:', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteAlbum(id)
      setAlbums(albums.filter(p => p.id !== id))
    } catch (err) {
      console.error('שגיאה במחיקת אלבום:', err)
    }
  }

  const handleEdit = async (id) => {
    const updatedTitle = prompt('כותרת חדשה:')
    if (!updatedTitle) return

    try {
      await api.updateAlbum(id, { title: updatedTitle })
      setAlbums(albums.map(p => p.id === id ? { ...p, title: updatedTitle } : p))
    } catch (err) {
      console.error('שגיאה בעריכת אלבום:', err)
    }
  }

  function Album({ album }) {
    const [showPhotos, setShowPhotos] = useState(false)

    return (
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{album.title}</h5>
          <p className="card-subtitle text-muted mb-3">נוצר ע"י: {album.user_name}</p>

          <div className="d-flex gap-2 flex-wrap mb-3">
            <button className="btn btn-outline-warning" onClick={() => handleEdit(album.id)}>ערוך</button>
            <button className="btn btn-outline-danger" onClick={() => handleDelete(album.id)}>מחק</button>
            <button className="btn btn-outline-primary" onClick={() => setShowPhotos(!showPhotos)}>
              {showPhotos ? 'הסתר תמונות' : 'הצג תמונות'}
            </button>
          </div>

          {showPhotos && <PhotoSection albumId={album.id} page={1} />}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-center text-primary">האלבומים שלי</h2>

        <div className="card p-3 mb-5 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h5 className="mb-3">הוסף אלבום חדש</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="כותרת"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <button className="btn btn-success w-100" onClick={handleAddAlbum}>הוסף אלבום</button>
        </div>

        {albums.length === 0 ? (
          <div className="alert alert-info text-center">אין עדיין אלבומים.</div>
        ) : (
          albums.map(album => (
            <Album key={album.id} album={album} />
          ))
        )}
      </div>
    </div>
  )
}

export default AlbumsPage
