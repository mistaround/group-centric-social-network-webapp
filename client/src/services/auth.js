import instance from "../utils/request";

export async function userLogin(user) {
  const response = await instance.post("/api/login", user);
  return response;
}

export async function userRegister(data) {
  const reponse = await instance.post("/api/register", data);
  return reponse;
}
