import { OrderProductsStore } from "../../models/order_products";
import { OrderStore } from "../../models/orders";
import { ProductStore } from "../../models/products";
import { UserStore } from "../../models/user";
import { DataBaseQuery } from "../../models/miscQueries";

describe("testing the misc queries model", () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();
  const orderStore = new OrderStore();
  const orderProductsStore = new OrderProductsStore();
  const databaseQuery = new DataBaseQuery();

  beforeAll(async () => {
    await orderStore.delete_table();
    await productStore.delete_table();
    await orderProductsStore.delete_table();
    await userStore.delete_table();

    await userStore.create({
      firstName: "user1",
      lastName: "lastname1",
      password: "password1",
    });
    await userStore.create({
      firstName: "user2",
      lastName: "lastname2",
      password: "password2",
    });

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

  it("tests getting the most popular products", async () => {
    const result = await databaseQuery.most_popular(1);

    const products = await orderProductsStore.index();
    const product = products.reduce((current, acc) => {
      return current.quantity > acc.quantity ? current : acc;
    });

    expect(result[0].product_id).toBe(product.product_id);
  });
});
