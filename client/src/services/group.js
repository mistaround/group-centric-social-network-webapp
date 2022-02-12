import instance from "../utils/request";

export async function getPublicGroups(size, page) {
  const publicGroups = await instance.get(
    `/api/group/public?skip=${page}&limit=${size}`
  );
  return publicGroups;
}

export async function getTrendingGroups() {
  const groups = await instance.get(`/api/group/trend`);
  return groups;
}

export async function getAllTags() {
  const tags = await instance.get(`/api/group/all_tags`);
  return tags;
}

export async function getGroupsByTag(tagId, size, page) {
  const groups = await instance.get(
    `/api/group/tag/${tagId}?skip=${page}&limit=${size}`
  );
  return groups;
}

export async function getGroupsSortTime(size, page) {
  const groups = await instance.get(
    `/api/group/time?skip=${page}&limit=${size}`
  );
  return groups;
}

export async function getGroupsSortPost(size, page) {
  const groups = await instance.get(
    `/api/group/post?skip=${page}&limit=${size}`
  );
  return groups;
}

export async function getGroupsSortMember(size, page) {
  const groups = await instance.get(
    `/api/group/member?skip=${page}&limit=${size}`
  );
  return groups;
}

export async function getPrivateGroups(size, page) {
  const publicGroups = await instance.get(
    `/api/group/private?skip=${page}&limit=${size}`
  );
  return publicGroups;
}

export async function getGroupById(groupId) {
  const group = await instance.get(`/api/group/${groupId}`);
  return group;
}

export async function checkGroupStatus(groupId) {
  const request = await instance.get(`/api/group/status/${groupId}`);
  return request;
}

export async function checkUserGroupStatus(groupId) {
  const request = await instance.get(`/api/group/user_group/${groupId}`);
  return request;
}

export async function createGroup(data) {
  const response = await instance.post(`/api/group`, data);
  return response;
}

export async function validateGroupName(groupName) {
  const request = await instance.get(`/api/group/validate/${groupName}`);
  return request;
}

export async function updateGroupInfo(groupId, data) {
  const request = await instance.put(`/api/group/${groupId}`, data);
  return request;
}

export async function joinGroup(groupId, userId) {
  const request = await instance.post(`/api/group/join`, { userId, groupId });
  return request;
}

export async function createRequest(groupId) {
  const response = await instance.post(`/api/group/request/${groupId}`);
  return response;
}

export async function removeRequest(groupId, userId) {
  const request = await instance.delete(`/api/group/request`, {
    data: { userId, groupId },
  });
  return request;
}

export async function quitGroup(groupId) {
  const response = await instance.delete(`/api/group/quit/${groupId}`);
  return response;
}
