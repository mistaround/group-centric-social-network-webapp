import instance from "../utils/request";

export async function getUserInfo() {
  const userInfo = await instance.get("/api/user");
  return userInfo;
}

export async function validateUsername(name) {
  const user = await instance.get(`/api/user/validate/${name}`);
  return user;
}

export async function validatePassword(password) {
  const valid = await instance.get(`/api/user/validate_pwd/${password}`);
  return valid;
}

export async function updateUser(id, data) {
  const response = await instance.put(`/api/user/${id}`, data);
  return response;
}

export async function getUserById(userId) {
  const response = await instance.get(`/api/user/${userId}`);
  return response;
}

export async function getUserByGroup(groupId, page, size) {
  const response = await instance.get(
    `/api/user/group/${groupId}?skip=${page}&limit=${size}`
  );
  return response;
}

export async function checkUserGroupRelation(groupId) {
  const response = await instance.get(`/api/group/user_group/${groupId}`);
  return response;
}

export async function promoteUser(data) {
  const response = await instance.put(`/api/user/admin/promote`, data);
  return response;
}

export async function demoteUser(data) {
  const response = await instance.put(`/api/user/admin/demote`, data);
  return response;
}

export async function searchUser(name) {
  const response = await instance.get(`/api/user/search/${name}`);
  return response;
}
