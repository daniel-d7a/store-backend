"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_products_1 = require("../models/order_products");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new order_products_1.OrderProductsStore();
const main = (app) => {
    app.get("/orders/products", verifyAuthToken, index);
    app.post("/orders/products", verifyAuthToken, add_product);
    app.get("/orders/:id/products", verifyAuthToken, show);
    app.delete("/orders/:order_id/products/:product_id", verifyAuthToken, delete_product_from_order);
};
const index = async (_req, res) => {
    try {
        const orderProducts = await store.index();
        console.log("inside index");
        res.json(orderProducts);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const show = async (req, res) => {
    try {
        const orderProducts = await store.show(parseInt(req.params.id));
        console.log("inside show");
        res.json(orderProducts);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const add_product = async (req, res) => {
    try {
        const orderProduct = {
            order_id: req.body.order_id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
        };
        const newOrderProduct = await store.create(orderProduct);
        res.status(201).json(newOrderProduct);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const delete_product_from_order = async (req, res) => {
    try {
        const orderProduct = await store.delete_product(parseInt(req.params.order_id), parseInt(req.params.product_id));
        res.status(204).json(orderProduct);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        next();
    }
    catch (error) {
        res.status(401);
    }
};
exports.default = main;
