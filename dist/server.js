"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const products_1 = require("./models/products");
const app = (0, express_1.default)();
const address = "0.0.0.0:3000";
app.use(body_parser_1.default.json());
app.get('/', async function (_req, res) {
    const productStore = new products_1.ProductStore();
    const prod = await productStore.create({
        price: 20,
        product_name: "cook book",
        category: "book",
        id: 1
    });
    res.send(prod);
});
app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
});
