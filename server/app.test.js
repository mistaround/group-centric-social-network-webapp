/* eslint-disable max-len */
const supertest = require("supertest");
// Import database operations
const app = require("./app");

// const payload = {
//   password: 1,
//   groupId: 12345,
//   locked: true,
//   deactivated: true,
//   hasNewMessage: true,
//   hasNewNotification: true,
// };

const testUser = {
  name: "testUser",
  password: "testUser123!",
};

const testUser1 = {
  name: "testUser1",
  password: "testUser123!",
};

const wrongUser = {
  name: "testUser",
  password: "test",
};

const userTestUser2 = {
  id: "61b651f4c13bc05f865f371f",
};

const userWrongUser = {
  name: "wrongUser",
  password: "wrongUser123!",
};

const promote = {
  userId: "61b651f4c13bc05f865f371f",
  groupId: "61a728f5776f1c4a00edb82f",
};

const invalidPromote = {
  userId: "m",
  groupId: "61b830e6aa00b12a404f4f22",
};

const wrongUserPromote = {
  userId: "61b651f4c13bc05f865f371e",
  groupId: "61a728f5776f1c4a00edb82f",
};

const wrongGroupPromote = {
  userId: "61b651f4c13bc05f865f371e",
  groupId: "61a728f5776f1c4a00edb82f",
};

// group.test
const testGroup = {
  owner: "61a40fd1548ac7931c1095e8",
  name: "test group",
  isPrivate: true,
};

const testRequest = {
  userId: "61b651f4c13bc05f865f371f",
  groupId: "61a728f5776f1c4a00edb82f",
};

const testRequestWrongGroup = {
  userId: "61a40fd1548ac7931c1095e8",
  groupId: "61a728f5776f1c4a00edb822",
};

const testGroupTag = {
  owner: "61a40fd1548ac7931c1095e8",
  name: "test group",
  tags: ["61a41098548ac7931c1095f4"],
  isPrivate: true,
};

// const testGroupTagNew = {
//   owner: "61a40fd1548ac7931c1095e8",
//   name: "testgroup",
//   tags: ["61a41098548ac7931c1095f4"],
//   isPrivate: true,
// };

const request = {
  userId: "61b651f4c13bc05f865f371f",
  groupId: "61a728f5776f1c4a00edb82f",
  date: Date.now,
};

const invalidRequest = {
  userId: "m",
  groupId: "61b830e6aa00b12a404f4f22",
};

const wrongRequest = {
  userId: "61b651f4c13bc05f865f371f",
  groupId: "61b830e6aa00b12a404f4f25",
};

const invalidGroupInfo = {
  avatarUrl: 1,
  aboutGroup: "testAbout",
  postDelNum: 0,
};

const groupInfo = {
  avatarUrl: "https://shareyou-file-server.s3.amazonaws.com/1639111728324.jpeg",
  aboutGroup: "testAbout",
  postDelNum: 0,
};

// chatTest
const invalidChat = {
  senderId: "61b651f4c13bc05f865f371",
  receiverId: "61aefa3d57d452c819e2e427",
};

const chat = {
  receiverId: "61aefa3d57d452c819e2e427",
  senderId: "61b651f4c13bc05f865f371f",
};

// postTest
const testPost = {
  groupId: "61b6cc8dbe91e9d062c211b9",
  title: "TestTitle",
  content: "TestContent",
  mediaUrl: ["https://shareyou-file-server.s3.amazonaws.com/1639281593886.jpg"],
  hasVideo: false,
  hasAudio: false,
  postTags: ["Upenn", "testTag"],
};

const testPostNoTag = {
  groupId: "61b6cc8dbe91e9d062c211b9",
  title: "TestTitle",
  content: "TestContent",
  mediaUrl: ["https://shareyou-file-server.s3.amazonaws.com/1639281593886.jpg"],
  hasVideo: false,
  hasAudio: false,
  postTags: [],
};

const groupIdInvalidPost = {
  groupId: "61b6cc8dbe91e9d062c211b",
  title: "TestTitle",
  content: "TestContent",
  mediaUrl: ["https://shareyou-file-server.s3.amazonaws.com/1639281593886.jpg"],
  hasVideo: false,
};

const testflag = {
  userId: "",
  postId: "",
};

// notification test

const wrongnotification = {
  name: "testUser",
  pass: "testUser123!",
};

const wrongnotification0 = {
  eventId: 0,
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const notification0 = {
  eventId: 0,
  memberId: "61b651f4c13bc05f865f371f",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification1 = {
  eventId: 1,
  requesterId: "61b651f4c13bc05f865f371f",
};

const notification1 = {
  eventId: 1,
  requesterId: "61b651f4c13bc05f865f371f",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification2 = {
  eventId: 2,
  requesterId: "61b651f4c13bc05f865f371f",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const notification2 = {
  eventId: 2,
  inviterId: "61b651f4c13bc05f865f371f",
  inviteeId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification3 = {
  eventId: 3,
  requesterId: "61b651f4c13bc05f865f371f",
};

const notification3 = {
  eventId: 3,
  inviterId: "61b651f4c13bc05f865f371f",
  inviteeId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification4 = {
  eventId: 4,
  requesterId: "61b651f4c13bc05f865f371f",
};

const notification4 = {
  eventId: 4,
  inviterId: "61b651f4c13bc05f865f371f",
  inviteeId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification5 = {
  eventId: 5,
  requesterId: "61b651f4c13bc05f865f371f",
};

const notification5 = {
  eventId: 5,
  inviterId: "61b651f4c13bc05f865f371f",
  inviteeId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification6 = {
  eventId: 6,
  requesterId: "61b651f4c13bc05f865f371f",
};

const notification6 = {
  eventId: 6,
  inviterId: "61b651f4c13bc05f865f371f",
  inviteeId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification7 = {
  eventId: 7,
  postId: "61b651f4c13bc05f865f371f",
};

// const notification7 = {
//   eventId: 7,
//   postId: "61b7ec7a865ef8050143e57b",
//   groupId: "61b6cc8dbe91e9d062c211b9",
// };

const wrongnotification8 = {
  eventId: 8,
  postId: "61b651f4c13bc05f865f371f",
};

const notification8 = {
  eventId: 8,
  memberId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

const wrongnotification9 = {
  eventId: 9,
  postId: "61b651f4c13bc05f865f371f",
};

const notification9 = {
  eventId: 9,
  requesterId: "61a4111e548ac7931c1095f8",
  groupId: "61b6cc8dbe91e9d062c211b9",
};

// const wrongnotification10 = {
//   eventId: 10,
//   postId: "61b651f4c13bc05f865f371f",
// };

// const notification10 = {
//   eventId: 10,
//   authorId: "61b651f4c13bc05f865f371f",
//   postId: "61b7ec7a865ef8050143e57b",
// };

const wrongnotification11 = {
  eventId: 11,
};

const notification11 = {
  eventId: 11,
  postId: "61ac2a200955707bd4ddefe0",
};

const wrongnotification12 = {
  eventId: 12,
};

const notification12 = {
  eventId: 12,
  postId: "61ac2a200955707bd4ddefe0",
};

// test comment
const invalidComment = {
  postId: "61a6aa323fc4758fc3ab1cc",
  content: "test comment",
};

const testComment = {
  postId: "61a6aa323fc4758fc3ab1cce",
  content: "test comment",
};

// test message
const invalidMessage = {
  senderId: "m",
  receiverId: "61a6def7a75bbc5153a02373",
  chatId: "61aecdf5aa9dc58ad556fb64",
  type: "text",
  text: "test message",
};

const testMessage = {
  senderId: "61a4111e548ac7931c1095f8",
  receiverId: "61a6def7a75bbc5153a02373",
  chatId: "61aecdf5aa9dc58ad556fb64",
  type: "text",
  text: "test message",
};

describe("Register", () => {
  test("Register with invalid email", async () => {
    const res = await supertest(app)
      .post("/api/register")
      .send({ ...testUser, email: "testUsertestUsercom" });
    expect(res.statusCode).toBe(400);
    // const response = await supertest(app).post("/api/login").send(testUser);
  });
  test("Register with occupied name", async () => {
    const res = await supertest(app)
      .post("/api/register")
      .send({ ...testUser, email: "testUser@testUser.com" });
    expect(res.statusCode).toBe(400);
    // const response = await supertest(app).post("/api/login").send(testUser);
  });
  test("Register with occupied email", async () => {
    const res = await supertest(app)
      .post("/api/register")
      .send({ ...testUser1, email: "testUser@testUser.com" });
    expect(res.statusCode).toBe(400);
    // const response = await supertest(app).post("/api/login").send(testUser);
  });
});

// Login
let token;
describe("Login", () => {
  test("Login", async () => {
    const res = await supertest(app).post("/api/login").send(testUser);
    expect(res.statusCode).toBe(200);
    token = res.header["auth-token"];
    // const response = await supertest(app).post("/api/login").send(testUser);
  });
  test("Login", async () => {
    const res = await supertest(app).post("/api/login").send(wrongUser);
    expect(res.statusCode).toBe(400);
    // const response = await supertest(app).post("/api/login").send(testUser);
  });
});

// usertest
describe("UserTest", () => {
  // GET: /api/user
  it("Call the API GET: /api/user, there should be user returned and status code 200", async () => {
    const response = await supertest(app)
      .get("/api/user")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/user/group/:id
  it("Call the API GET: /api/user/group/:id, invalid group id cause status code 400", async () => {
    const response = await supertest(app)
      .get("/api/user/group/1")
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/user/group/:id, get users in a group and return 200", async () => {
    const response = await supertest(app)
      .get("/api/user/group/61b6cc8dbe91e9d062c211b9")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/user/validate/wronguser
  it("Call the API GET: /api/user/validate/wronguser, username has been occupied will cause a 200 status code", async () => {
    const response = await supertest(app).get("/api/user/validate/wronguser");
    expect(response.statusCode).toBe(200);
  });
  it("Call the API GET: /api/user/validate/{name}, username has not been occupied, then there should be user returned and status code 200", async () => {
    const response = await supertest(app).get("/api/user/validate/{name}");
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/user/{id}
  it("Call the API GET: /api/user/{id}, invalid user id will cause a 400 status code", async () => {
    const id = "61b651f4c13bc05f865f371";
    const response = await supertest(app)
      .get(`/api/user/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/user/{id}, user not exist will cause a 404 status code", async () => {
    const id = "61b651f4c13bc05f865f3722";
    const response = await supertest(app)
      .get(`/api/user/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API GET: /api/user/{id}, there should be user returned and status code 200", async () => {
    const id = "61b651f4c13bc05f865f371f";
    const response = await supertest(app)
      .get(`/api/user/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // PUT: /api/user/{id}
  it("Call the API PUT: /api/user/{id}, invalid user info, e.g. password, will cause a 400 status code", async () => {
    const id = "61b651f4c13bc05f865f371f";
    const response = await supertest(app)
      .put(`/api/user/${id}`)
      .send(userWrongUser)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API PUT: /api/user/{id}, but user doesn't exist will cause a 500 status code", async () => {
    const id = "61b651f4c13bc05f865f3710";
    const response = await supertest(app)
      .put(`/api/user/${id}`)
      .send(userTestUser2)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API PUT: /api/user/{id}, user should be updated and status code 201", async () => {
    const id = "61b651f4c13bc05f865f371f";
    const response = await supertest(app)
      .put(`/api/user/${id}`)
      .send(userTestUser2)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // PUT: /api/user/admin/promote
  it("Call the API PUT: /api/user/admin/promote, invalid user be promoted and status code 400", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/promote")
      .send(invalidPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API PUT: /api/user/admin/promote, wrong user be promoted and status code 404", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/promote")
      .send(wrongUserPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API PUT: /api/user/admin/promote, wrong group be promoted to and status code 404", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/promote")
      .send(wrongGroupPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API PUT: /api/user/admin/promote, user should be promoted and status code 201", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/promote")
      .send(promote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // PUT: /api/user/admin/demote
  it("Call the API PUT: /api/user/admin/demote, invalid user be promoted and status code 400", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/demote")
      .send(invalidPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API PUT: /api/user/admin/demote, wrong user be promoted and status code 404", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/demote")
      .send(wrongUserPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API PUT: /api/user/admin/demote, wrong group be promoted to and status code 404", async () => {
    const response = await supertest(app)
      .put("/api/user/admin/demote")
      .send(wrongGroupPromote)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
});

// grouptest: Delete testgroup in group before testing
describe("GroupTest", () => {
  // POST: /api/group
  it("Call the API POST: /api/group, but invalid group info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/group")
      .send(testGroup)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group, but group already exists will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/group")
      .send(testGroupTag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // it("Call the API POST: /api/group, there should be an object returned and status code 201", async () => {
  //   const response = await supertest(app)
  //     .post("/api/group")
  //     .send(testGroupTagNew)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(201);
  // });
  // GET: /api/group/trend
  it("Call the API GET: /api/group/trend, there should be trending groups returned and status code 200", async () => {
    const response = await supertest(app)
      .get("/api/group/trend")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/group/public
  it("Call the API GET: /api/group/public, there should be public groups returned and status code 200", async () => {
    const response = await supertest(app)
      .get("/api/group/public")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/group/private
  // it("Call the API GET: /api/group/private, there should be private groups returned and status code 200", async () => {
  //   const response = await supertest(app)
  //     .get("/api/group/private")
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(200);
  // });
  // GET: /api/group/status/{id}
  // it("Call the API GET: /api/group/status/{id}, but invalid group info will cause a 400 status code", async () => {
  //   const id = "61b651f4c13bc05f865f371";
  //   const response = await supertest(app)
  //     .get(`/api/group/status/${id}`)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(400);
  // });
  // it("Call the API GET: /api/group/status/{id}, but group doesn't exist will cause a 400 status code", async () => {
  //   const response = await supertest(app).get("/api/group/status/{id}");
  //   expect(response.statusCode).toBe(400);
  // });
  // it("Call the API GET: /api/group/status/{id}, if user has joined group, returned and status code 200", async () => {
  //   const response = await supertest(app).get("/api/group/status/{id}");
  //   expect(response.statusCode).toBe(200);
  // });
  // it("Call the API GET: /api/group/status/{id}, if request already exists, returned and status code 200", async () => {
  //   const response = await supertest(app).get("/api/group/status/{id}");
  //   expect(response.statusCode).toBe(400);
  // });
  // POST: /api/group/join
  it("Call the API POST: /api/group/join, but wrong user join info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/group/join")
      .send(testUser)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/join, but group doesn't exist will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/group/join")
      .send(testRequestWrongGroup)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/join, should join a new group and status code 201", async () => {
    const response = await supertest(app)
      .post("/api/group/join")
      .send(testRequest)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // DELETE: /api/group/quit/{id}
  it("Call the API DELETE: /api/group/quit/{id}, but invalid groupid will cause a 400 status code", async () => {
    const id = "61a40fd1548ac7931c1095e";
    // id above is the group id to be deleted
    const response = await supertest(app)
      .delete(`/api/group/quit/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/group/quit/{id}, but group doesn't exist will cause a 400 status code", async () => {
    const id = "61a40fd1548ac7931c109511";
    const response = await supertest(app)
      .delete(`/api/group/quit/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/group/quit/{id}, but user not in the group will cause a 400 status code", async () => {
    // When running this test, make sure the test user 61b651f4c13bc05f865f371f is not in this group id
    const id = "61a41098548ac7931c1095ec";
    const response = await supertest(app)
      .delete(`/api/group/quit/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // current test user doesn't own a group
  // it("Call the API DELETE: /api/group/quit/{id}, but user is the owner of the group will cause a 400 status code", async () => {
  //   const id = "61a728f5776f1c4a00edb82f";
  //   const response = await supertest(app)
  //     .delete(`/api/group/quit/${id}`)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(400);
  // });
  it("Call the API DELETE: /api/group/quit/{id}, user should leave the group and status code 201", async () => {
    const id = "61a728f5776f1c4a00edb82f";
    const response = await supertest(app)
      .delete(`/api/group/quit/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // POST: /api/group/request/:id
  it("Call the API POST: /api/group/request/:id, but invalid request info will cause a 400 status code", async () => {
    const id = "11";
    const response = await supertest(app)
      .post(`/api/group/request/${id}`)
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/request/:id, but group doesn't exist will cause a 400 status code", async () => {
    const id = "61b6cc8dbe91e9d062c211b1";
    const response = await supertest(app)
      .post(`/api/group/request/${id}`)
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/request/:id, but user already in will cause a 400 status code", async () => {
    const id = "61b6cc8dbe91e9d062c211b9";
    const response = await supertest(app)
      .post(`/api/group/request/${id}`)
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/request/:id, request create and 201 status code", async () => {
    const id = "61a728f5776f1c4a00edb82f";
    const response = await supertest(app)
      .post(`/api/group/request/${id}`)
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/group/request/:id, request existed and 400 status code", async () => {
    const id = "61a728f5776f1c4a00edb82f";
    const response = await supertest(app)
      .post(`/api/group/request/${id}`)
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // GET: /api/group/request/:groupId
  it("Call the API GET: /api/group/request/:groupId, but invalid group info will cause a 400 status code", async () => {
    const id = "11";
    const response = await supertest(app)
      .get(`/api/group/request/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/group/request/:groupId, but group doesn't exist will cause a 400 status code", async () => {
    const id = "61b6cc8dbe91e9d062c211b1";
    const response = await supertest(app)
      .get(`/api/group/request/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/group/request/:groupId, but request doesn't exist will cause a 400 status code", async () => {
    const id = "61a41098548ac7931c1095ec";
    const response = await supertest(app)
      .get(`/api/group/request/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API GET: /api/group/request/:groupId, find the request return 200 status code", async () => {
    const id = "61b50eccd70d4142ec65310e";
    const response = await supertest(app)
      .get(`/api/group/request/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // DELETE: /api/group
  it("Call the API DELETE: /api/group/request, but invalid request will cause a 400 status code", async () => {
    const response = await supertest(app)
      .delete("/api/group/request")
      .send(invalidRequest)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/group/request, but group doesn't exist will cause a 404 status code", async () => {
    const response = await supertest(app)
      .delete("/api/group/request")
      .send(wrongRequest)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API DELETE: /api/group/request, delete request return 201 status code", async () => {
    const response = await supertest(app)
      .delete("/api/group/request")
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API DELETE: /api/group/request, request doesn't exist return 404 status code", async () => {
    const response = await supertest(app)
      .delete("/api/group/request")
      .send(request)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  // GET: /api/group/:id
  it("Call the API GET: /api/group/:id, but invalid group info will cause a 400 status code", async () => {
    const id = "11";
    const response = await supertest(app)
      .get(`/api/group/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/group/:id, but group doesn't exist will cause a 404 status code", async () => {
    const id = "61ac1e14fe9f5e9d85e2158e";
    const response = await supertest(app)
      .get(`/api/group/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(404);
  });
  it("Call the API GET: /api/group/:id, but group is private will cause a 403 status code", async () => {
    const id = "61ac1e14fe9f5e9d85e2158d";
    const response = await supertest(app)
      .get(`/api/group/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(403);
  });
  it("Call the API GET: /api/group/:id, return a group with 200 status code", async () => {
    const id = "61b6cc8dbe91e9d062c211b9";
    const response = await supertest(app)
      .get(`/api/group/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/validate/:name
  it("Call the API GET: /api/validate/:name, but occupied group name will cause a 200 status code", async () => {
    const name = "test group";
    const response = await supertest(app)
      .get(`/api/group/validate/${name}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  it("Call the API GET: /api/validate/:name, group name not occupied will cause a 400 status code", async () => {
    const name = "new group";
    const response = await supertest(app)
      .get(`/api/group/validate/${name}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // PUT: /api/user
  it("Call the API PUT: /api/user, invalid group info, e.g. password, will cause a 400 status code", async () => {
    const id = "11";
    const response = await supertest(app)
      .put(`/api/group/${id}`)
      .send(invalidGroupInfo)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API PUT: /api/user, invalid group id(params.id), will cause a 400 status code", async () => {
    const id = "11";
    const response = await supertest(app)
      .put(`/api/group/${id}`)
      .send(groupInfo)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API PUT: /api/user, invalid group info, e.g. password, will cause a 400 status code", async () => {
    const id = "61b6cc8dbe91e9d062c211b9";
    const response = await supertest(app)
      .put(`/api/group/${id}`)
      .send(groupInfo)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
});

// Manually delete newest chat after testing
describe("chat test", () => {
  // POST: /api/chat
  it("Call the API POST: /api/chat, but invalid chat info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/chat")
      .send(invalidChat)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/chat, create a chat and return a 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/chat")
      .send(chat)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // GET: /api/chat/id
  it("Call the API GET: /api/chat/id, there should be an object returned and status code 400", async () => {
    const id = "61aefa3d57d452c819e2e42";
    const response = await supertest(app)
      .get(`/api/chat/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/chat/id, there should be an object returned and status code 200", async () => {
    const id = "61a4111e548ac7931c1095f8";
    const response = await supertest(app)
      .get(`/api/chat/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/chat
  it("Call the API GET: /api/chat, there should be an object returned and status code 200", async () => {
    const response = await supertest(app)
      .get("/api/chat")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
});

// Here add 2 post, 1 tag, 1 hide. Delete after testing
describe("Post Test", () => {
  // POST: /api/post
  it("Call the API POST: /api/post, but invalid post info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/post")
      .send(groupIdInvalidPost)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group, there should be an object returned and status code 201", async () => {
    const response = await supertest(app)
      .post("/api/post")
      .send(testPostNoTag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/group, there should be an object returned and status code 201", async () => {
    const response = await supertest(app)
      .post("/api/post")
      .send(testPost)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // GET: /api/post
  it("Call the API GET: /api/post, there should be an object returned and status code 200", async () => {
    const response = await supertest(app)
      .get("/api/post")
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/post/{groupId}
  it("Call the API GET: /api/post/{groupId}, but invalid groupId will cause a 400 status code", async () => {
    const groupId = "11";
    const response = await supertest(app)
      .get(`/api/post/${groupId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/post/{groupId}, there should be posts returned and status code 200", async () => {
    const groupId = "61b6cc8dbe91e9d062c211b9";
    const response = await supertest(app)
      .get(`/api/post/${groupId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // POST: /api/post/flag/{id}
  it("Call the API POST: /api/post/flag/{id}, but wrong flag info will cause a 400 status code", async () => {
    // id is the post id to be flagged
    const id = "61a4532adfe9bd4283f2a69";
    const response = await supertest(app)
      .post(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/post/flag/{id}, but postId doesn't exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a692";
    const response = await supertest(app)
      .post(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/group/flag/{id}, there should be an object returned and status code 201", async () => {
    const id = "61a4532adfe9bd4283f2a693";
    const response = await supertest(app)
      .post(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/post/flag/{id}, but flag with same user and post already exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a693";
    const response = await supertest(app)
      .post(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // PUT: /api/post/flag/{id}
  it("Call the API PUT: /api/post/flag/{id}, but wrong flag info will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a69";
    const response = await supertest(app)
      .put(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API PUT: /api/post/flag/{id}, but postId doesn't exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a691";
    const response = await supertest(app)
      .put(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // it("Call the API PUT: /api/post/flag/{id}, but flag doesn't exist will cause a 400 status code", async () => {
  //   const id = "61a6aa323fc4758fc3ab1cce";
  //   const response = await supertest(app)
  //     .put(`/api/post/flag/${id}`)
  //     .send(testflag)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(400);
  // });
  it("Call the API PUT: /api/post/flag/{id}, flag should be updated to false and status code 201", async () => {
    const id = "61a4532adfe9bd4283f2a693";
    const response = await supertest(app)
      .put(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // DELETE: /api/post/flag/{id}
  it("Call the API DELETE: /api/post/flag/{id}, but wrong flag info will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a69";
    const response = await supertest(app)
      .delete(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/post/flag/{id}, but postId doesn't exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a691";
    const response = await supertest(app)
      .delete(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // it("Call the API DELETE: /api/post/flag/{id}, but flag doesn't exist will cause a 400 status code", async () => {
  //   const id = "61a6aa323fc4758fc3ab1cce";
  //   const response = await supertest(app)
  //     .delete(`/api/post/flag/${id}`)
  //     .send(testflag)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(400);
  // });
  it("Call the API DELETE: /api/post/flag/{id}, flag should be updated to false and status code 201", async () => {
    const id = "61a4532adfe9bd4283f2a693";
    const response = await supertest(app)
      .delete(`/api/post/flag/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // POST: /api/post/hide/{id}
  it("Call the API POST: /api/post/hide/{id}, but wrong hide info will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a69";
    const response = await supertest(app)
      .post(`/api/post/hide/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/post/hide/{id}, but postId doesn't exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a691";
    const response = await supertest(app)
      .post(`/api/post/hide/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  // it("Call the API POST: /api/group/hide/{id}, the post should be hide and status code 201", async () => {
  //   const id = "61a4532adfe9bd4283f2a693";
  //   const response = await supertest(app)
  //     .post(`/api/post/hide/${id}`)
  //     .send(testflag)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(201);
  // });
  it("Call the API POST: /api/post/hide/{id}, but hide already exist will cause a 400 status code", async () => {
    const id = "61a4532adfe9bd4283f2a693";
    const response = await supertest(app)
      .post(`/api/post/hide/${id}`)
      .send(testflag)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  //  // DELETE: /api/post/{id}
  //   it("Call the API DELETE: /api/post/{id}, but wrong id will cause a 400 status code", async () => {
  //     const id = "61a4532adfe9bd4283f2a69";
  //     const response = await supertest(app)
  //       .delete(`/api/post/hide/${id}`)
  //       .set("auth-token", token);
  //     expect(response.statusCode).toBe(400);
  //   });
  //   it("Call the API DELETE: /api/post/{id}, but post doesn't exist", async () => {
  //     const id = "61a4532adfe9bd4283f2a691";
  //     const response = await supertest(app)
  //       .delete(`/api/post/hide/${id}`)
  //       .set("auth-token", token);
  //     expect(response.statusCode).toBe(400);
  //   });
  //   it("Call the API DELETE: /api/post/{id}, there should be a post returned and status code 201", async () => {
  //     const id = "61a4532adfe9bd4283f2a69";
  //     const response = await supertest(app)
  //       .delete(`/api/post/hide/${id}`)
  //       .set("auth-token", token);
  //     expect(response.statusCode).toBe(400);
});

// notification test
// record new notification id
let notificationId;
describe("Notification Test", () => {
  it("Call the API POST: /api/notification, invalid notification will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/notification, invalid 0 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification0)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 0 will promote to become an adminstor and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification0)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 1 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification1)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 1 will deny of joining and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification1)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 2 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification2)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 2 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification2)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 3 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification3)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 3 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification3)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 4 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification4)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 4 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification4)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 5 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification5)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 5 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification5)
      .set("auth-token", token);
    notificationId = response.body.data._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 6 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification6)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 6 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification6)
      .set("auth-token", token);
    notificationId = response.body.data[0]._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 7 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification7)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  // it("Call the API POST: /api/notification, 7 will success and return 200 status code", async () => {
  //   const response = await supertest(app)
  //     .post("/api/notification")
  //     .send(notification7)
  //     .set("auth-token", token);
  //   notificationId = response.body.data[0]._id;
  //   expect(response.statusCode).toBe(200);
  // });
  // it("delete notification test item", async () => {
  //   const response = await supertest(app)
  //     .delete(`/api/notification/${notificationId}`)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(201);
  // });
  it("Call the API POST: /api/notification, invalid 8 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification8)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 8 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification8)
      .set("auth-token", token);
    notificationId = response.body.data[0]._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 9 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification9)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 9 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification9)
      .set("auth-token", token);
    notificationId = response.body.data[0]._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // it("Call the API POST: /api/notification, invalid 10 will cause a 500 status code", async () => {
  //   const response = await supertest(app)
  //     .post("/api/notification")
  //     .send(wrongnotification10)
  //     .set("auth-token", token);
  //   expect(response.statusCode).toBe(500);
  // });
  // it("Call the API POST: /api/notification, 10 will success and return 200 status code", async () => {
  //   const response = await supertest(app)
  //     .post("/api/notification")
  //     .send(notification10)
  //     .set("auth-token", token);
  //   notificationId = response.body.data._id;
  //   expect(response.statusCode).toBe(200);
  // });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 11 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification11)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 11 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification11)
      .set("auth-token", token);
    notificationId = response.body.data[0]._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("Call the API POST: /api/notification, invalid 12 will cause a 500 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(wrongnotification12)
      .set("auth-token", token);
    expect(response.statusCode).toBe(500);
  });
  it("Call the API POST: /api/notification, 12 will success and return 200 status code", async () => {
    const response = await supertest(app)
      .post("/api/notification")
      .send(notification12)
      .set("auth-token", token);
    notificationId = response.body.data[0]._id;
    expect(response.statusCode).toBe(200);
  });
  it("delete notification test item", async () => {
    const response = await supertest(app)
      .delete(`/api/notification/${notificationId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  it("invalid notification deletion", async () => {
    const response = await supertest(app)
      .delete("/api/notification/1")
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
});

// test comment

let commentId;
// Post GRE is used to test. Stored in post
// :D. Just want to make this comment. This comment is used
describe("Test comment", () => {
  // POST: /api/comment
  it("Call the API POST: /api/comment, but invalid post info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/comment")
      .send(invalidComment)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/comment, add post info and return 201 status code", async () => {
    const response = await supertest(app)
      .post("/api/comment")
      .send(testComment)
      .set("auth-token", token);
    commentId = response.body.data._id;
    expect(response.statusCode).toBe(201);
  });
  // GET: /api/comment/:id
  it("Call the API GET: /api/comment/:id, but invalid post info will cause a 400 status code", async () => {
    const id = "m";
    const response = await supertest(app)
      .get(`/api/comment/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/comment/:id, get post info and return 201 status code", async () => {
    const id = "61a6aa323fc4758fc3ab1cce";
    const response = await supertest(app)
      .get(`/api/comment/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // PUT: /api/comment/:id
  it("Call the API POST: /api/comment/:id, but invalid post info will cause a 400 status code", async () => {
    const id = "m";
    const response = await supertest(app)
      .put(`/api/comment/${id}`)
      .send(invalidComment)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/comment/:id, comment doesn't exist will cause a 400 status code", async () => {
    const id = "61a6aa323fc4758fc3ab1cce";
    const response = await supertest(app)
      .put(`/api/comment/${id}`)
      .send(testComment)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/comment/:id, update other's comment will cause a 401 status code", async () => {
    const id = "61b7c4b55219328ef43541df";
    const response = await supertest(app)
      .put(`/api/comment/${id}`)
      .send(testComment)
      .set("auth-token", token);
    expect(response.statusCode).toBe(401);
  });
  it("Call the API POST: /api/comment/:id, add comment info and return 201 status code", async () => {
    const response = await supertest(app)
      .put(`/api/comment/${commentId}`)
      .send(testComment)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
  // delete the comment with commentId
  it("Call the API DELETE: /api/comment/:id, but invalid post info will cause a 400 status code", async () => {
    const id = "m";
    const response = await supertest(app)
      .delete(`/api/comment/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/comment/:id, comment doesn't exist will cause a 400 status code", async () => {
    const id = "61a6aa323fc4758fc3ab1cce";
    const response = await supertest(app)
      .delete(`/api/comment/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API DELETE: /api/comment/:id, delete comment info  will cause a 201 status code", async () => {
    const response = await supertest(app)
      .delete(`/api/comment/${commentId}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(201);
  });
});

// Use chatId "61aecdf5aa9dc58ad556fb64", The second chat in database between JasonQiu and Leolee
// Save second chat and first message for test
describe("Test message", () => {
  // POST: /api/messgae
  it("Call the API POST: /api/message, but invalid post info will cause a 400 status code", async () => {
    const response = await supertest(app)
      .post("/api/message")
      .send(invalidMessage)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API POST: /api/message, post a chat message and return status code", async () => {
    const response = await supertest(app)
      .post("/api/message")
      .send(testMessage)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
  // GET: /api/messgae
  it("Call the API GET: /api/message, but invalid post info will cause a 400 status code", async () => {
    const id = "m";
    const response = await supertest(app)
      .get(`/api/message/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(400);
  });
  it("Call the API GET: /api/message, return all messages in this chatId with a 200 status code", async () => {
    const id = "61aecdf5aa9dc58ad556fb64";
    const response = await supertest(app)
      .get(`/api/message/${id}`)
      .set("auth-token", token);
    expect(response.statusCode).toBe(200);
  });
});
