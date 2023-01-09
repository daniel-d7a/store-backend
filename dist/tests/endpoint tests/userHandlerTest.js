"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../../server"));
const user_1 = require("../../models/user");
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
describe("testing user handler", () => {
    let store = new user_1.UserStore();
    let token;
    beforeEach(async () => {
        const user = {
            firstName: "eyad",
            lastName: "alsherif",
            password: "test_test",
        };
        const newUser = await store.create(user);
        token = jsonwebtoken_1.default.sign({ user: newUser }, process.env.TOKEN_SECRET);
    });
    afterEach(async () => {
        await store.delete_table();
    });
    it("tests getting all users", async () => {
        const test = await (0, supertest_1.default)(server_1.default)
            .get("/User")
            .set("Authorization", `Bearer ${token}`);
        expect(test.status).toBe(200);
    });
    it("tests getting a user with an id", async () => {
        const result = await store.index();
        const id = result[0].id;
        const test = await (0, supertest_1.default)(server_1.default)
            .get(`/User/${id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(test.body.firstname).toBe("eyad");
    });
    it("tests creating a user", async () => {
        const user = {
            firstName: "fname",
            lastName: "lname",
            password: "test password",
        };
        const test = await (0, supertest_1.default)(server_1.default)
            .post(`/User`)
            .send(user)
            .set("Authorization", `Bearer ${token}`);
        try {
            jsonwebtoken_1.default.verify(test.body, process.env.TOKEN_SECRET);
        }
        catch (err) {
            throw new Error(err);
        }
    });
});
