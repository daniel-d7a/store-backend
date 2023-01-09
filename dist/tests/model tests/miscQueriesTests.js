"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_products_1 = require("../../models/order_products");
const orders_1 = require("../../models/orders");
const products_1 = require("../../models/products");
const user_1 = require("../../models/user");
const miscQueries_1 = require("../../models/miscQueries");
describe("testing the misc queries model", () => {
    const userStore = new user_1.UserStore();
    const productStore = new products_1.ProductStore();
    const orderStore = new orders_1.OrderStore();
    const orderProductsStore = new order_products_1.OrderProductsStore();
    const databaseQuery = new miscQueries_1.DataBaseQuery();
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
