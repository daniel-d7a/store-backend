import app from "../../server";
import supertest from "supertest";
import { ProductStore } from "../../models/products";
import { UserStore } from "../../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("testing products handler", () => {
  let store: ProductStore;

  let userStore = new UserStore();
  let token: string = "";

  beforeAll(async () => {
    const user = {
      firstName: "eyad",
      lastName: "alsherif",
      password: "test_test",
    };

    const newUser = await userStore.create(user);

    token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string);
  });

  afterAll(async () => {
    await userStore.delete_table();
  });

  beforeEach(async () => {
    store = new ProductStore();

    await store.create({
      price: 1200,
      product_name: "gaming mouse",
      category: "gaming",
    });
    await store.create({
      price: 3500,
      product_name: "samsung buds+",
      category: "earbuds",
    });
  });

  afterEach(async () => {
    await store.delete_table();
  });

  it("tests getting all the products", async () => {
    const test = await supertest(app).get("/products");
    expect(test.status).toBe(200);
  });
  it("tests getting a product with a specific id", async () => {
    const result = await store.index();
    const id = result[0].id;

    const test = await supertest(app).get(`/products/${id}`);
    expect(test.status).toBe(200);
  });

  it("tests creating a product", async () => {
    const test = await supertest(app)
      .post("/products")
      .send({
        price: 1000,
        product_name: "hp monitor",
        category: "monitor",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(test.status).toBe(201);
  });

  it("tests getting products from a specific category", async () => {
    const test = await supertest(app).get("/products/category/gaming");

    expect(test.status).toBe(200);
  });
});
