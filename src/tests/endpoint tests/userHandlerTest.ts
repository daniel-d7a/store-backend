import app from "../../server";
import { UserStore } from "../../models/user";
import supertest from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("testing user handler", () => {
  let store = new UserStore();
  let token: string;

  beforeEach(async () => {
    const user = {
      firstName: "eyad",
      lastName: "alsherif",
      password: "test_test",
    };

    const newUser = await store.create(user);

    token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
  });

  afterEach(async () => {
    await store.delete_table();
  });

  it("tests getting all users", async () => {
    const test = await supertest(app)
      .get("/User")
      .set("Authorization", `Bearer ${token}`);

    expect(test.status).toBe(200);
  });

  it("tests getting a user with an id", async () => {
    const result = await store.index();
    const id = result[0].id
    const test = await supertest(app)
      .get(`/User/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(test.body.firstname).toBe("eyad");
  });
  it("tests creating a user", async () => {

    const user = {
        firstName: "fname",
        lastName: "lname",
        password: "test password",
      }

    const test = await supertest(app)
      .post(`/User`)
      .send(user)
      .set("Authorization", `Bearer ${token}`);

    
    try {
      jwt.verify(test.body, process.env.TOKEN_SECRET as string);
    } catch (err :any) {
      throw new Error(err)
    }
    
  });


});
