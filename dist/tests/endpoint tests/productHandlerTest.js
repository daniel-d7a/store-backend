"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const products_1 = require("../../models/products");
const user_1 = require("../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("testing products handler", () => {
    let store;
    let userStore = new user_1.UserStore();
    let token = "";
    beforeAll(async () => {
        const user = {
            firstName: "eyad",
            lastName: "alsherif",
            password: "test_test",
        };
        const newUser = await userStore.create(user);
        token = jsonwebtoken_1.default.sign({ user: newUser }, process.env.TOKEN_SECRET);
    });
    afterAll(async () => {
        await userStore.delete_table();
    });
    beforeEach(async () => {
        store = new products_1.ProductStore();
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
        const test = await (0, supertest_1.default)(server_1.default).get("/products");
        expect(test.status).toBe(200);
    });
    it("tests getting a product with a specific id", async () => {
        const result = await store.index();
        const id = result[0].id;
        const test = await (0, supertest_1.default)(server_1.default).get(`/products/${id}`);
        expect(test.status).toBe(200);
    });
    it("tests creating a product", async () => {
        const test = await (0, supertest_1.default)(server_1.default)
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
        const test = await (0, supertest_1.default)(server_1.default).get("/products/category/gaming");
        expect(test.status).toBe(200);
    });
});
