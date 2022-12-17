"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
const client_1 = __importDefault(require("../client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserStore {
    async index() {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM users";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM users WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not get user with id ${id}. Error: ${err}`);
        }
    }
    async create(user) {
        try {
            const conn = await client_1.default.connect();
            const sql = "INSERT INTO users(firstName, lastName, password_digist) VALUES($1, $2, $3) RETURNING *";
            const saltRounds = process.env.SALT_ROUNDS;
            const pepper = process.env.BCRYPT_PASSWORD;
            const hashedPassword = bcrypt_1.default.hashSync(user.password_digist + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [
                user.firstName,
                user.lastName,
                hashedPassword,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create user. Error: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
