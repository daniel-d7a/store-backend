import app from "../../server";
import supertest from "supertest";
import { OrderProductsStore } from "../../models/order_products";
import { OrderStore } from "../../models/orders";
import { ProductStore } from "../../models/products";
import { UserStore } from "../../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

describe("testing queries handler", () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();
  const orderStore = new OrderStore();
  const orderProductsStore = new OrderProductsStore();
  let token: string;

  beforeAll(async () => {
    await orderStore.delete_table();
    await productStore.delete_table();
    await orderProductsStore.delete_table();
    await userStore.delete_table();

    const user = await userStore.create({
      firstName: "user1",
      lastName: "lastname1",
      password: "password1",
    });
    await userStore.create({
      firstName: "user2",
      lastName: "lastname2",
      password: "password2",
    });

    token = jwt.sign({ user }, process.env.TOKEN_SECRET as string);

    const users = await userStore.index();

    await orderStore.create({
      user_id: users[0].id,
      status: "completed",
    });
    await orderStore.create({
      user_id: users[1].id,
      status: "current",
    });

    await productStore.create({
      price: 1200,
      product_name: "gaming mouse",
      category: "gaming",
    });
    await productStore.create({
      price: 3500,
      product_name: "samsung buds+",
      category: "earbuds",
    });
  });

  beforeEach(async () => {
    const orders = await orderStore.index();
    const products = await productStore.index();

    await orderProductsStore.create({
      order_id: orders[1].id,
      product_id: products[1].id,
      quantity: 27,
    });
    await orderProductsStore.create({
      order_id: orders[0].id,
      product_id: products[0].id,
      quantity: 69,
    });
  });

  afterEach(async () => {
    await orderProductsStore.delete_table();
  });

  afterAll(async () => {
    await orderStore.delete_table();
    await productStore.delete_table();
    await userStore.delete_table();
  });

  it("tests getting all order_products", async () => {
    const test = await supertest(app)
      .get("/orders/products")
      .set("Authorization", `Bearer ${token}`);

    expect(test.status).toBe(200);
  });
  it("tests getting products of a specific order", async () => {
    const result = await orderProductsStore.index();
    const id = result[0].id;

    const test = await supertest(app)
      .get(`/orders/${id}/products`)
      .set("Authorization", `Bearer ${token}`);

    expect(test.status).toBe(200);
  });

  it("tests adding a new order_product", async () => {
    const orders = await orderStore.index();
    const products = await productStore.index();

    const test = await supertest(app)
      .post("/orders/products")
      .send({
        order_id: orders[0].id,
        product_id: products[1].id,
        quantity: 5,
      })
      .set("Authorization", `Bearer ${token}`);

    expect(test.status).toBe(201);
  });

  it("tests deleteing a product from an order", async () => {
    const order_products = await orderProductsStore.index();
    const { order_id, product_id } = order_products[0];
    const test = await supertest(app)
      .delete(`/orders/${order_id}/products/${product_id}`)
      .set("Authorization", `Bearer ${token}`);

    console.log(test.body);

    expect(test.status).toBe(204);
  });
});
