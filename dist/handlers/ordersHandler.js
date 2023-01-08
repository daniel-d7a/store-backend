"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../models/orders");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new orders_1.OrderStore();
const main = (app) => {
    app.get("/orders/current", verifyAuthToken, current_order);
    app.get("/orders/complete", verifyAuthToken, complete_order);
};
const current_order = async (req, res) => {
    try {
        const orders = await store.current_order_by_user(parseInt(req.body.id));
        res.json(orders);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const complete_order = async (req, res) => {
    try {
        const orders = await store.completed_orders_by_user(parseInt(req.body.id));
        res.json(orders);
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
