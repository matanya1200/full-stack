import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPhotos, addPhotoServer, updatePhotoServer, deletePhotoServer } from "../API/AlbumsService";
import "../CSS/albums.css";

function AlbumDetails() {
  const { id, albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(5);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoName, setNewPhotoName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPhotos(albumId).then(setPhotos);
  }, [albumId]);

  const loadMorePhotos = () => {
    setVisiblePhotos(prev => prev + 5);
  };

  const addPhoto = async () => {
    if (!newPhotoUrl) return;
    const data = await addPhotoServer(albumId, newPhotoName, newPhotoUrl);
    setPhotos([...photos, data]);
    setNewPhotoUrl("");
    setNewPhotoName("");
  };

  const deletePhoto = async (id) => {
    await deletePhotoServer(id);
    setPhotos(photos.filter(p => p.id !== id));
  };

  const updatePhoto = async (id, oldUrl, oldTitle) => {
    const url = prompt("כתובת חדשה לתמונה:", oldUrl);
    const title = prompt("שם חדש לתמונה:", oldTitle);
    if (url && url !== oldUrl) {
      await updatePhotoServer(id, { url, title });
      setPhotos(photos.map(p => (p.id === id ? { ...p, url, title } : p)));
    }
  };

  return (
    <div className="photos-wrapper">
      <h4 className="titel-photos" >תמונות באלבום #{albumId}</h4>

      <div className="photos-add">
        <input
          className="albums-input"
          placeholder="כתובת תמונה חדשה"
          value={newPhotoUrl}
          onChange={(e) => setNewPhotoUrl(e.target.value)}
        />
        <input
          className="albums-input"
          placeholder="שם תמונה חדשה"
          value={newPhotoName}
          onChange={(e) => setNewPhotoName(e.target.value)}
        />
        <button className="albums-btn" onClick={addPhoto}>הוסף תמונה</button>
      </div>

      <div className="photos-grid">
        {photos.slice(0, visiblePhotos).map(photo => (
          <div key={photo.id} className="photo-card">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              width="150"
              onClick={() => setSelectedPhoto(photo)}
              className="photo-thumb"
            />
            <div>{photo.title}</div>
            <button className="albums-btn" onClick={() => updatePhoto(photo.id, photo.url, photo.title)}>עדכן</button>
            <button className="albums-btn delete" onClick={() => deletePhoto(photo.id)}>מחק</button>
          </div>
        ))}
      </div>

      {visiblePhotos < photos.length && (
        <button className="albums-btn load-more" onClick={loadMorePhotos}>
          טען עוד תמונות
        </button>
      )}

      {selectedPhoto && (
        <div className="photo-popup" onClick={() => setSelectedPhoto(null)}>
          <img src={selectedPhoto.url} alt={selectedPhoto.title} className="photo-full" />
        </div>
      )}

      <button className="albums-btn load-more" onClick={()=>navigate(`/home/users/${id}/albums`)}>חזרה</button>
    </div>
  );
}

export default AlbumDetails;
