import app from "../../server";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OrderStore } from "../../models/orders";
import { UserStore } from "../../models/user";

dotenv.config();

describe("testing orders model", () => {
  let store: OrderStore;
  const userStore = new UserStore();

  let token_1: string;
  // let token_2: string;

  beforeAll(async () => {
    const user_1 = await userStore.create({
      firstName: "user1",
      lastName: "lastname1",
      password: "password1",
    });
    // const user_2 =
    await userStore.create({
      firstName: "user2",
      lastName: "lastname2",
      password: "password2",
    });

    token_1 = jwt.sign({ user: user_1 }, process.env.TOKEN_SECRET as string);
    // token_2 = jwt.sign({ user: user_2 }, process.env.TOKEN_SECRET as string);
  });

  beforeEach(async () => {
    store = new OrderStore();
    const users = await userStore.index();

    await store.create({
      user_id: users[0].id,
      status: "completed",
    });
    await store.create({
      user_id: users[1].id,
      status: "current",
    });
  });

  afterEach(async () => {
    await store.delete_table();
  });
  afterAll(async () => {
    await userStore.delete_table();
  });

  it("tests getting complete orders of a user", async () => {
    const result = await userStore.index();

    const test = await supertest(app)
      .get("/orders/complete")
      .set("Authorization", `Bearer ${token_1}`)
      .send({ id: result[0].id });

    expect(test.status).toBe(200);
  });

  it("tests getting current orders of a user", async () => {
    const result = await userStore.index();

    const test = await supertest(app)
      .get("/orders/current")
      .set("Authorization", `Bearer ${token_1}`)
      .send({ id: result[1].id });

    expect(test.status).toBe(200);
  });
});
