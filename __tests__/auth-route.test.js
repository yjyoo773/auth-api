"use strict";

process.env.SECRET = "hello";

const server = require("../src/server").server;
const supergoose = require("@code-fellows/supergoose");
// const bearer = require('../src/auth/middleware/bearer')

const mockReq = supergoose(server);

let users = {
  admin: { username: "admin", password: "password" },
  editor: { username: "editor", password: "password" },
  user: { username: "user", password: "password" },
};

describe("AUTH ROUTES", () => {
  Object.keys(users).forEach((userType) => {
    describe(`${userType} users`, () => {
      it("Can create an account", async () => {
        const res = await mockReq.post("/signup").send(users[userType]);
        const userObj = res.body;

        expect(res.status).toBe(201);
        expect(userObj.token).toBeDefined();
        expect(userObj.user._id).toBeDefined();
        expect(userObj.user.username).toEqual(users[userType].username);
      });

      it("Can siginin with basic", async () => {
        const res = await mockReq
          .post("/signin")
          .auth(users[userType].username, users[userType].password);
        const token = res.body.token;

        const bearerRes = await mockReq.get('/secret').set('Authorization',`Bearer ${token}`)

        expect(bearerRes.status).toBe(200);
      });
    });

    describe("Bad Logins", () => {
      it("Basic fails with known user and wrong password", async () => {
        const res = await mockReq.post("/signin").auth(
          "admin",
          "wrongPassword"
        );
        const userObj = res.body;

        expect(res.status).toBe(403);
        expect(userObj.user).not.toBeDefined();
        expect(userObj.token).not.toBeDefined();
      });
    });
  });
});
