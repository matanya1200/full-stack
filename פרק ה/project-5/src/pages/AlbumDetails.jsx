import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPhotos, addPhotoServer, updatePhotoServer, deletePhotoServer } from "../API/AlbumsService";
import "../CSS/albums.css";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
    if (!data) {
      toast.error("שגיאה בהוספת התמונה");
      return;
    }
    toast.success("התמונה נוספה בהצלחה!");
    setPhotos([...photos, data]);
    setNewPhotoUrl("");
    setNewPhotoName("");
  };

  const deletePhoto = async (id) => {
    await deletePhotoServer(id);
    if (!id) {
      toast.error("שגיאה במחיקת התמונה");
      return;
    }
    toast.success("התמונה נמחקה בהצלחה!");
    setPhotos(photos.filter(p => p.id !== id));
  };

  const updatePhoto = async (id, oldUrl, oldTitle) => {
    const { value: url } = await Swal.fire({
      title: 'כתובת חדשה לתמונה',
      input: 'text',
      inputLabel:'כתוב כתובת חדשה לתמונה',
      inputValue: oldUrl,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
    const { value: title } = await Swal.fire({
      title: 'שם חדש לתמונה',
      input: 'text',
      inputLabel: 'כתוב שם חדש לתמונה',
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
    if (url && url !== oldUrl) {
      await updatePhotoServer(id, { url, title });
      if (!id) {
        toast.error("שגיאה בעדכון התמונה");
        return;
      }
      toast.success("התמונה עודכנה בהצלחה!");
      // Update the photo in the state
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

      <button className="albums-back" onClick={()=>navigate(`/home/users/${id}/albums`)}>חזרה לאלבומים</button>
    </div>
  );
}

export default AlbumDetails;
