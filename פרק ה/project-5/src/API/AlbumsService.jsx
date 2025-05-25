const BASE_URL = "http://localhost:3001";

// Albums
export const getAlbums = async (userId) => {
  const res = await fetch(`${BASE_URL}/albums?userId=${userId}`);
  let data = await res.json();
  data = data.filter(albums => albums.userId === Number(userId) || albums.userId === userId);
  return data;};

export const addAlbumServer = async (userId, title) => {
  const res = await fetch(`${BASE_URL}/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title }),
  });
  return res.json();
};

export const updateAlbumServer = async (id, updates) => {
  await fetch(`${BASE_URL}/albums/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const deleteAlbumServer = async (id) => {
  await fetch(`${BASE_URL}/albums/${id}`, { method: "DELETE" });
};

// Photos
export const getPhotos = async (albumId) => {
  const res = await fetch(`${BASE_URL}/photos?albumId=${albumId}`);
  let data = await res.json();
  data = data.filter(photo => photo.albumId === Number(albumId) || photo.albumId === albumId);
  return data;
};

export const addPhotoServer = async (albumId, title, url) => {
  const res = await fetch(`${BASE_URL}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ albumId, title, url }),
  });
  return res.json();
};

export const updatePhotoServer = async (id, updates) => {
  await fetch(`${BASE_URL}/photos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const deletePhotoServer = async (id) => {
  await fetch(`${BASE_URL}/photos/${id}`, { method: "DELETE" });
};
