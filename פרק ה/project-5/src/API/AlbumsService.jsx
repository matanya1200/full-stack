const BASE_URL = "http://localhost:3001";

// Albums
export const getAlbums = async (userId) => {
  const res = await fetch(`${BASE_URL}/albums?userId=${userId}`);
  return res.json();
};

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
  return res.json();
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
