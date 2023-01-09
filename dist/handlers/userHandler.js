"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const store = new user_1.UserStore();
const main = (app) => {
    app.get("/User", verifyAuthToken, index);
    app.get("/User/:id", verifyAuthToken, show);
    app.post("/User", create);
};
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const show = async (req, res) => {
    try {
        const user = await store.show(parseInt(req.params.id));
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json(err);
    }
};
const create = async (req, res) => {
    try {
        const user = {
            firstName: req.body.firstname,
            lastName: req.body.lastName,
            password: req.body.firstname,
        };
        const newUser = await store.create(user);
        const token = jsonwebtoken_1.default.sign({ user: newUser }, process.env.TOKEN_SECRET);
        res.status(201).json(token);
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
