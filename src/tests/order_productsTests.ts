import { OrderProductsStore } from "../models/order_products";
import { OrderStore } from "../models/orders";
import { ProductStore } from "../models/products";
import { UserStore } from "../models/user";

describe("testing the order_products model", () => {
  const userStore = new UserStore();
  const productStore = new ProductStore();
  const orderStore = new OrderStore();
  const orderProductsStore = new OrderProductsStore();

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
      order_id: orders[0].id,
      product_id: products[0].id,
      quantity: 69,
    });
    await orderProductsStore.create({
      order_id: orders[1].id,
      product_id: products[1].id,
      quantity: 27,
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

  it("tests creating new order_products", async () => {
    const orders = await orderStore.index();
    const products = await productStore.index();

    await orderProductsStore.create({
      order_id: orders[0].id,
      product_id: products[1].id,
      quantity: 5,
    });

    const result = await orderProductsStore.index();
    expect(result.length).toBe(3);
  });

  it("tests indexing the order_products", async () => {
    const result = await orderProductsStore.index();
    expect(result.length).toBe(2);
  });
  it("tests showing the order_products with a specific id", async () => {
    const order_products = await orderProductsStore.index();

    const result = await orderProductsStore.show(order_products[0].id);
    expect(result.quantity).toBe(69);
  });
  it("tests deleteing the order_products with a specific order id and product id", async () => {
    const order_products = await orderProductsStore.index();

    await orderProductsStore.delete_product(
      order_products[0].order_id,
      order_products[0].product_id
    );

    const result = await orderProductsStore.show(order_products[0].id);

    expect(result).toBeUndefined();
  });
});
