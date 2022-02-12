import instance from "../utils/request";

export async function getHomePosts(size, page) {
  const posts = await instance.get(`/api/post?skip=${page}&limit=${size}`);
  return posts;
}

export async function createPost(data) {
  const response = await instance.post(`/api/post`, data);
  return response;
}

export async function getPostByGroupId(groupId, page, size) {
  const response = await instance.get(
    `/api/post/${groupId}?skip=${page}&limit=${size}`
  );
  return response;
}

export async function getPostById(postId) {
  const response = await instance.get(`/api/post/single/${postId}`);
  return response;
}

export async function getCommentByPostId(postId, page, size) {
  const response = await instance.get(
    `/api/comment/${postId}?skip=${page}&limit=${size}`
  );
  return response;
}

export async function deletePostById(postId) {
  const response = await instance.delete(`/api/post/${postId}`);
  return response;
}

export async function createComment(data) {
  const response = await instance.post(`/api/comment`, data);
  return response;
}

export async function editComment(commentId, data) {
  const response = await instance.put(`/api/comment/${commentId}`, data);
  return response;
}

export async function deleteComment(commentId) {
  const response = await instance.delete(`/api/comment/${commentId}`);
  return response;
}

export async function createFlag(postId) {
  const response = await instance.post(`/api/post/flag/${postId}`);
  return response;
}

export async function enableHide(postId) {
  const response = await instance.post(`/api/post/hide/${postId}`);
  return response;
}

export async function checkHide(postId) {
  const response = await instance.get(`/api/post/hide/${postId}`);
  return response;
}

export async function undoFlag(postId) {
  const response = await instance.put(`/api/post/flag/${postId}`);
  return response;
}

export async function deleteFlag(postId) {
  const response = await instance.delete(`/api/post/flag/${postId}`);
  return response;
}

export async function deletePost(postId) {
  const response = await instance.delete(`/api/post/${postId}`);
  return response;
}

export async function getPostOfCurUser(page, size) {
  const response = await instance.get(
    `/api/post/user?skip=${page}&limit=${size}`
  );
  return response;
}
