"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const miscQueries_1 = require("../models/miscQueries");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new miscQueries_1.DataBaseQuery();
const main = (app) => {
    app.get("/most_popular_products", most_popular_products);
};
const most_popular_products = async (req, res) => {
    try {
        const products = await store.most_popular(parseInt(req.body.count));
        res.json(products);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
exports.default = main;
