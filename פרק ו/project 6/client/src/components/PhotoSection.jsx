import { useEffect, useState } from 'react'
import api from '../services/api'

function PhotoSection({ albumId }) {
  const [photos, setPhotos] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [newPhotoTitle, setNewPhotoTitle] = useState('')
  const [newPhotoUrl, setNewPhotoUrl] = useState('')

  useEffect(() => {
    setPhotos([])
    setPage(1)
    setHasMore(true)
  }, [albumId])

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await api.getPhotosByAlbume(albumId, page)
        if (data.length === 0) {
          setHasMore(false)
          return
        }
        setPhotos(prev => [...prev, ...data])
      } catch (error) {
        console.error('שגיאה בטעינת תמונות:', error)
      }
    }

    fetchPhotos()
  }, [albumId, page])

  const handleLoadMore = () => {
    if (hasMore) setPage(prev => prev + 1)
  }

  const handleAddPhoto = async () => {
    if (!newPhotoTitle || !newPhotoUrl) return
    try {
      const { data } = await api.addPhoto(albumId, newPhotoTitle, newPhotoUrl)
      setPhotos(prev => [...prev, data])
      setNewPhotoTitle('')
      setNewPhotoUrl('')
    } catch (err) {
      console.error('שגיאה בהוספת תמונה:', err)
    }
  }

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.deletePhoto(albumId, photoId)
      setPhotos(prev => prev.filter(photo => photo.id !== photoId))
    } catch (err) {
      console.error('שגיאה במחיקת תמונה:', err)
    }
  }

  const handleEditPhoto = async (photoId) => {
    const updatedTitle = prompt('כותרת חדשה (השאר ריק אם אין שינוי):')
    const updatedUrl = prompt('URL חדש (השאר ריק אם אין שינוי):')

    if (!updatedTitle && !updatedUrl) return

    const updates = {}
    if (updatedTitle) updates.title = updatedTitle
    if (updatedUrl) updates.url = updatedUrl

    try {
      await api.updatePhoto(albumId, photoId, updates.title, updates.url)
      setPhotos(prev => prev.map(photo =>
        photo.id === photoId
          ? { ...photo, ...(updates.title && { title: updates.title }), ...(updates.url && { url: updates.url }) }
          : photo
      ))
    } catch (err) {
      console.error('שגיאה בעריכת תמונה:', err)
    }
  }

  return (
    <div className="mt-4">
      <h5 className="text-primary">תמונות באלבום</h5>

      {/* טופס הוספה */}
      <div className="row g-2 align-items-end mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="כותרת"
            value={newPhotoTitle}
            onChange={e => setNewPhotoTitle(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="URL"
            value={newPhotoUrl}
            onChange={e => setNewPhotoUrl(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button className="btn btn-success w-100" onClick={handleAddPhoto}>הוסף תמונה</button>
        </div>
      </div>

      {/* תצוגת תמונות */}
      <div className="d-flex flex-wrap gap-3">
        {photos.map(photo => (
          <div key={photo.id} className="card" style={{ width: '160px' }}>
            <img src={photo.url} className="card-img-top" alt={photo.title} />
            <div className="card-body p-2">
              <p className="card-text small">{photo.title}</p>
              <div className="d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-warning" onClick={() => handleEditPhoto(photo.id)}>ערוך</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletePhoto(photo.id)}>מחק</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* טעינת עוד */}
      {hasMore && (
        <div className="text-center mt-3">
          <button className="btn btn-outline-secondary" onClick={handleLoadMore}>טען עוד תמונות</button>
        </div>
      )}
    </div>
  )
}

export default PhotoSection
