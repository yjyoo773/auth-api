"use strict";

process.env.SECRET = "hello";

const server = require("../src/server").server;
const supergoose = require("@code-fellows/supergoose");
const bearer = require("../src/auth/middleware/bearer");

const mockReq = supergoose(server);

let user = { username: "admin", password: "password", role: "admin" };
let item = { name: "test protien", calories: 999, type: "PROTIEN" };

describe("V2 ROUTES", () => {
  it("Can add an item to the database and return an object with the added item", async () => {
    let newUser = await mockReq.post("/signup").send(user);
    let token = newUser.body.token;

    let res = await mockReq
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${token}`)
      .send(item);
    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(item.name);
    expect(res.body.calories).toEqual(item.calories);
    expect(res.body.type).toEqual(item.type);
  });

  it("Can get a single item by ID", async () => {
    let user = { username: "admin2", password: "password", role: "admin" };

    let newUser = await mockReq.post("/signup").send(user);
    let token = newUser.body.token;

    let newFood = await mockReq
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${token}`)
      .send(item);
    console.log("new food get single item", newFood.body);
    let id = newFood.body._id;
    let res = await mockReq
      .get(`/api/v2/food/${id}`)
      //   .set("Authorization", `Bearer ${token}`);
      .auth(user.username, user.password);

    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(item.name);
    expect(res.body.calories).toEqual(item.calories);
    expect(res.body.type).toEqual(item.type);
  });

  it("Can get a list of items", async () => {
    let user = { username: "admin3", password: "password", role: "admin" };

    let newUser = await mockReq.post("/signup").send(user);
    let token = newUser.body.token;

    await mockReq
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${token}`)
      .send(item);
    let res = await mockReq
      .get("/api/v1/food")
      //   .set("Authorization", `Bearer ${token}`);
      .auth(user.username, user.password);
    console.log("getAll", res.body);
    expect(res.status).toEqual(200);
  });

  it("Can update an item", async () => {
    let user = { username: "admin4", password: "password", role: "admin" };

    let newUser = await mockReq.post("/signup").send(user);
    let token = newUser.body.token;
    let newItem = { name: "test fruit update", calories: 0, type: "FRUIT" };
    let oldItem = await mockReq
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${token}`)
      .send(newItem);
    let id = oldItem.body._id;
    let res = await mockReq
      .put(`/api/v2/food/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(newItem);
    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(newItem.name);
    expect(res.body.calories).toEqual(newItem.calories);
  });

  it("Can delete an item", async () => {
    let user = { username: "admin5", password: "password", role: "admin" };

    let newUser = await mockReq.post("/signup").send(user);
    let token = newUser.body.token;
    let toDelete = await mockReq
      .post("/api/v2/food")
      .set("Authorization", `Bearer ${token}`)
      .send(item);
    let id = toDelete.body._id;
    let res = await mockReq
      .delete(`/api/v2/food/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    let checkDelete = await mockReq
      .get(`/api/v2/food/${id}`)
      //   .set("Authorization", `Bearer ${token}`);
      .auth(user.username, user.password);

    expect(checkDelete.body).toEqual(null);
  });
});
