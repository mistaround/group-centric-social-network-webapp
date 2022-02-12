import instance from "../utils/request";

export default async function createChat(data) {
  const response = await instance.post(`/api/chat`, data);
  return response;
}
