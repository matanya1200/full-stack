import { useEffect, useState } from "react";

function Albums() {
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
    fetch(`http://localhost:3001/albums?userId=${user.id}`)
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
      body: JSON.stringify({ userId: user.id, title: newAlbumTitle }),
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
    <div>
      <h3>רשימת האלבומים</h3>

      <input
        placeholder="חיפוש לפי כותרת או ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <input
          placeholder="כותרת אלבום חדש"
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
        />
        <button onClick={addAlbum}>הוסף אלבום</button>
      </div>

      <ul>
        {filtered.map(album => (
          <li key={album.id} style={{ marginTop: "10px"}}> 
            <strong>{album.id}</strong>:{" "}
            <span
              style={{ color: selectedAlbumId === album.id ? "red" : "blue", cursor: "pointer" }}
              onClick={() => selectAlbum(album)}
            >
              {album.title}
            </span>
            <button onClick={() => updateAlbum(album.id, album.title)}>עדכן</button>
            <button onClick={() => deleteAlbum(album.id)}>מחק</button>
          </li>
        ))}
      </ul>

      {selectedAlbum && (
        <div style={{ border: "1px solid black", padding: 10, marginTop: 20 }}>
          <h4>תמונות באלבום: {selectedAlbum.title}</h4>

          <div style={{ marginBottom: 10 }}>
            <input
              placeholder="כתובת תמונה חדשה"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
            />
            <input
              placeholder="שם תמונה חדשה"
              value={newPhotoName}
              onChange={(e) => setnewPhotoName(e.target.value)}
            />
            <button onClick={addPhoto}>הוסף תמונה</button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {photos.slice(0, visiblePhotos).map(photo => (
              <div key={photo.id} style={{ border: "1px solid #ccc", padding: 5 }}>
                <img src={photo.thumbnailUrl} alt={photo.title} width="150" onClick={() => setSelectedPhoto(photo)} 
                style={{cursor: "pointer"}}/>
                <div>{photo.title}</div>
                <button onClick={() => updatePhoto(photo.id, photo.url, photo.title)}>עדכן</button>
                <button onClick={() => deletePhoto(photo.id)}>מחק</button>
              </div>
            ))}
          </div>

          {visiblePhotos < photos.length && (
            <button onClick={loadMorePhotos} style={{ marginTop: 10 }}>
              טען עוד תמונות
            </button>
          )}

          {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              cursor: "pointer"
            }}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              style={{ maxHeight: "90%", maxWidth: "90%" }}
            />
          </div>
        )}

        </div>
      )}
    </div>
  );
}

export default Albums;
