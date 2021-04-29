"use strict";

const server = require("../src/server").server;
const supergoose = require("@code-fellows/supergoose");

const mockReq = supergoose(server);

let item = { name: "test fruit1", calories: 999, type: "FRUIT" };

describe("V1 ROUTES", () => {
  it("Can add an item to the database and return an object with the added item", async () => {
    const res = await mockReq.post("/api/v1/food").send(item);
    expect(res.status).toBe(201);
    expect(res.body.name).toEqual(item.name);
    expect(res.body.calories).toEqual(item.calories);
    expect(res.body.type).toEqual(item.type);
  });

  it("Can get a single item by ID", async () => {
    let newFood = await mockReq.post("/api/v1/food").send(item);
    let id = newFood.body._id;
    let res = await mockReq.get(`/api/v1/food/${id}`);
    expect(res.status).toEqual(200);
    expect(res.body.name).toEqual(item.name);
    expect(res.body.calories).toEqual(item.calories);
    expect(res.body.type).toEqual(item.type);
  });

  it("Can get a list of items", async () => {
    let res = await mockReq.get("/api/v1/food");
    console.log("getAll", res.body);
    expect(res.status).toEqual(200);
  });

  it("Can update an item",async()=>{
      let newItem = { name: "test fruit update", calories: 0, type: "FRUIT" };
      let oldItem = await mockReq.post("/api/v1/food").send(newItem)
      let id = oldItem.body._id
      let res = await mockReq.put(`/api/v1/food/${id}`).send(newItem)
      expect(res.status).toBe(200)
      expect(res.body.name).toEqual(newItem.name)
      expect(res.body.calories).toEqual(newItem.calories)
  })

  it("Can delete an item",async()=>{
      let toDelete = await mockReq.post("/api/v1/food").send(item)
      let id = toDelete.body._id
      let res = await mockReq.delete(`/api/v1/food/${id}`)
      expect(res.status).toBe(200)
      let checkDelete = await mockReq.get(`/api/v1/food/${id}`)
      expect(checkDelete.body).toEqual(null)
  })
});
