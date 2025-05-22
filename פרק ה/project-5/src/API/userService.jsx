const BASE_URL = "http://localhost:3001";

export const updateUser = async (userId, fieldsToUpdate) => {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fieldsToUpdate),
  });

  if (!res.ok) throw new Error("Failed to update user");
  return res.json(); 
};

export const getUserByUsername = async (username) => {
  const res = await fetch(`${BASE_URL}/users?username=${username}`);
  if (!res.ok) throw new Error("Failed to fetch user by username");
  return res.json(); 
};

export const createUser = async (newUser) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  });

  if (!res.ok) throw new Error("Failed to create user");
  return res.json(); 
};
