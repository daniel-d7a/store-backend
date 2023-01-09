"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const orders_1 = require("../../models/orders");
const user_2 = require("../../models/user");
dotenv_1.default.config();
describe("testing orders model", () => {
    let store;
    const userStore = new user_2.UserStore();
    let token_1;
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
        token_1 = jsonwebtoken_1.default.sign({ user: user_1 }, process.env.TOKEN_SECRET);
        // token_2 = jwt.sign({ user: user_2 }, process.env.TOKEN_SECRET as string);
    });
    beforeEach(async () => {
        store = new orders_1.OrderStore();
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
        const test = await (0, supertest_1.default)(server_1.default)
            .get("/orders/complete")
            .set("Authorization", `Bearer ${token_1}`)
            .send({ id: result[0].id });
        expect(test.status).toBe(200);
    });
    it("tests getting current orders of a user", async () => {
        const result = await userStore.index();
        const test = await (0, supertest_1.default)(server_1.default)
            .get("/orders/current")
            .set("Authorization", `Bearer ${token_1}`)
            .send({ id: result[1].id });
        expect(test.status).toBe(200);
    });
});
