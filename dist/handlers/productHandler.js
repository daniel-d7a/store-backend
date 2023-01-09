"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const products_1 = require("../models/products");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new products_1.ProductStore();
const main = (app) => {
    app.get("/products", index);
    app.get("/products/:id", show);
    app.post("/products", verifyAuthToken, create);
    app.get("/products/category/:category", products_by_category);
};
const index = async (_req, res) => {
    try {
        const products = await store.index();
        res.status(200).json(products);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const show = async (req, res) => {
    try {
        const products = await store.show(parseInt(req.params.id));
        res.status(200).json(products);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const create = async (req, res) => {
    try {
        const product = {
            price: req.body.price,
            product_name: req.body.product_name,
            category: req.body.category,
        };
        const newProduct = await store.create(product);
        res.status(201).json(newProduct);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const products_by_category = async (req, res) => {
    try {
        const products = await store.products_by_category(req.params.category);
        res.status(200).json(products);
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
