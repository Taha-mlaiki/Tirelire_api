import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

describe("POST auth/register ", () => {
  test("it should return successful message", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "taha",
      lastName: "mlaiki",
      email: "totyuy035@gmail.com",
      password: "taha12345",
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success");
  });

  test("it should return an error message", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
});
