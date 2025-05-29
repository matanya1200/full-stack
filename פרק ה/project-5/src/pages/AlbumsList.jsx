import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAlbums, addAlbumServer, updateAlbumServer, deleteAlbumServer } from "../API/AlbumsService";
import "../CSS/albums.css";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function AlbumsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState("");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  useEffect(() => {
    getAlbums(user.id).then(setAlbums);
  }, [user.id]);

  const filtered = albums.filter(
    a => a.title.toLowerCase().includes(search.toLowerCase()) || a.id.toString() === search
  );

  const selectAlbum = (album) => {
    navigate(`/home/users/${user.id}/albums/${album.id}/photos`);
  };

  const addAlbum = async () => {
    if (!newAlbumTitle) return;
    const data = await addAlbumServer(user.id, newAlbumTitle);
    if (!data) {
      toast.error("שגיאה בהוספת האלבום");
      return;
    }   
    toast.success("האלבום נוסף בהצלחה!");
    setAlbums([...albums, data]);
    setNewAlbumTitle("");
  };

  const deleteAlbum = async (albumId) => {
    await deleteAlbumServer(albumId);
    if (!albumId) {
      toast.error("שגיאה במחיקת האלבום");
      return;
    }
    toast.success("האלבום נמחק בהצלחה!");
    setAlbums(albums.filter(a => a.id !== albumId));
  };

  const updateAlbum = async (albumId, oldTitle) => {
    const { value: title } = await Swal.fire({
      title: 'כותרת חדשה',
      input: 'text',
      inputLabel: 'כתוב כותרת חדשה',
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
    if (title && title !== oldTitle) {
      await updateAlbumServer(albumId, { title });
      if (!albumId) {
        toast.error("שגיאה בעדכון האלבום");
        return;
      }
      toast.success("האלבום עודכן בהצלחה!");
      setAlbums(albums.map(a => (a.id === albumId ? { ...a, title } : a)));
    }
  };

  return (
    <div className="albums-wrapper">
      <h3 className="albums-title">רשימת האלבומים</h3>

      <div className="albums-toolbar">
        <input
          className="albums-search"
          placeholder="חיפוש לפי כותרת או ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="albums-add">
          <input
            className="albums-input"
            placeholder="כותרת אלבום חדש"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
          />
          <button className="albums-btn" onClick={addAlbum}>הוסף אלבום</button>
        </div>
      </div>

      <ul className="albums-list">
        {filtered.map(album => (
          <li key={album.id} className="album-item">
            <div className="album-info">
              <strong>{album.id}</strong>: {" "}
              <span
                className={`album-title`}
                onClick={() => selectAlbum(album)}
              >
                {album.title}
              </span>
            </div>
            <div className="album-actions">
              <button className="albums-btn" onClick={() => updateAlbum(album.id, album.title)}>עדכן</button>
              <button className="albums-btn delete" onClick={() => deleteAlbum(album.id)}>מחק</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AlbumsList;
