"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import main from "../../handlers/userHandler";
const server_1 = __importDefault(require("../../server"));
const supertest_1 = __importDefault(require("supertest"));
describe("testing root handler", () => {
    it("tests the root route", async () => {
        const test = await (0, supertest_1.default)(server_1.default).get("/");
        expect(test.status).toBe(200);
    });
});
