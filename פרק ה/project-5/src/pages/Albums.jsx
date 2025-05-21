import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import "../CSS/albums.css";

function Albums() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(5);
  const [search, setSearch] = useState("");
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoName, setnewPhotoName] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/albums?userId=${id}`)
      .then(res => res.json())
      .then(data => setAlbums(data));
  }, [user.id]);

  const filtered = albums.filter(
    a =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toString() === search
  );

  const selectAlbum = async (album) => {
    setSelectedAlbumId(album.id);
    setSelectedAlbum(album);
    setVisiblePhotos(5);
    const res = await fetch(`http://localhost:3001/photos?albumId=${album.id}`);
    const data = await res.json();
    setPhotos(data);
  };

  const loadMorePhotos = () => {
    setVisiblePhotos(prev => prev + 5);
  };

  const addAlbum = async () => {
    if (!newAlbumTitle) return;
    const res = await fetch(`http://localhost:3001/albums`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, title: newAlbumTitle }),
    });
    const data = await res.json();
    setAlbums([...albums, data]);
    setNewAlbumTitle("");
  };

  const deleteAlbum = async (id) => {
    await fetch(`http://localhost:3001/albums/${id}`, { method: "DELETE" });
    setAlbums(albums.filter(a => a.id !== id));
    if (selectedAlbum?.id === id) {
      setSelectedAlbum(null);
      setPhotos([]);
    }
  };

  const updateAlbum = async (id, oldTitle) => {
    const title = prompt("כותרת חדשה לאלבום:", oldTitle);
    if (title && title !== oldTitle) {
      await fetch(`http://localhost:3001/albums/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setAlbums(albums.map(a => (a.id === id ? { ...a, title } : a)));
      if (selectedAlbum?.id === id) setSelectedAlbum({ ...selectedAlbum, title });
    }
  };

  const addPhoto = async () => {
    if (!newPhotoUrl || !selectedAlbum) return;
    const thumbnailUrl = newPhotoUrl//.replace("/600/400", "/150/100");
    const res = await fetch(`http://localhost:3001/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        albumId: selectedAlbum.id,
        url: newPhotoUrl,
        title: newPhotoName || `Photo ${photos.length + 1}`,
        thumbnailUrl: thumbnailUrl
      }),
    });
    const data = await res.json();
    setPhotos([...photos, data]);
    setNewPhotoUrl("");
    setnewPhotoName("");
  };

  const deletePhoto = async (id) => {
    await fetch(`http://localhost:3001/photos/${id}`, { method: "DELETE" });
    setPhotos(photos.filter(p => p.id !== id));
  };

  const updatePhoto = async (id, oldUrl, oldTitle) => {
    const url = prompt("כתובת חדשה לתמונה:", oldUrl);
    const title = prompt("שם חדש לתמונה:", oldTitle);
    if (url && url !== oldUrl) {
      await fetch(`http://localhost:3001/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url:url , title:title, thumbnailUrl:url}),
      });
      setPhotos(photos.map(p => (p.id === id ? { ...p, url } : p)));
    }
  };

  return (
<div className="albums-wrapper">
  <h3 className="albums-title">רשימת האלבומים</h3>

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

  <ul className="albums-list">
    {filtered.map(album => (
      <li key={album.id} className="album-item">
        <div className="album-info">
          <strong>{album.id}</strong>:{" "}
          <span
            className={`album-title ${selectedAlbumId === album.id ? "selected" : ""}`}
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

  {selectedAlbum && (
    <div className="photos-wrapper">
      <h4>תמונות באלבום: {selectedAlbum.title}</h4>

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
          onChange={(e) => setnewPhotoName(e.target.value)}
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
    </div>
  )}
</div>

  );
}

export default Albums;
