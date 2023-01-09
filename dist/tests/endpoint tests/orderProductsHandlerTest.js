"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const order_products_1 = require("../../models/order_products");
const orders_1 = require("../../models/orders");
const products_1 = require("../../models/products");
const user_1 = require("../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("testing queries handler", () => {
    const userStore = new user_1.UserStore();
    const productStore = new products_1.ProductStore();
    const orderStore = new orders_1.OrderStore();
    const orderProductsStore = new order_products_1.OrderProductsStore();
    let token;
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
        token = jsonwebtoken_1.default.sign({ user }, process.env.TOKEN_SECRET);
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
        const test = await (0, supertest_1.default)(server_1.default)
            .get("/orders/products")
            .set("Authorization", `Bearer ${token}`);
        expect(test.status).toBe(200);
    });
    it("tests getting products of a specific order", async () => {
        const result = await orderProductsStore.index();
        const id = result[0].id;
        const test = await (0, supertest_1.default)(server_1.default)
            .get(`/orders/${id}/products`)
            .set("Authorization", `Bearer ${token}`);
        expect(test.status).toBe(200);
    });
    it("tests adding a new order_product", async () => {
        const orders = await orderStore.index();
        const products = await productStore.index();
        const test = await (0, supertest_1.default)(server_1.default)
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
        const test = await (0, supertest_1.default)(server_1.default)
            .delete(`/orders/${order_id}/products/${product_id}`)
            .set("Authorization", `Bearer ${token}`);
        console.log(test.body);
        expect(test.status).toBe(204);
    });
});
