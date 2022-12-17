"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const client_1 = __importDefault(require("../client"));
class ProductStore {
    async index() {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Couldn't get products. Error:${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM products WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Couldn't get product with id ${id}. Error:${err}`);
        }
    }
    async create(product) {
        try {
            const conn = await client_1.default.connect();
            const sql = "INSERT INTO products(product_name, price, category) VALUES ($1, $2, $3) RETURNING *";
            const result = await conn.query(sql, [
                product.product_name,
                product.price,
                product.category,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Couldn't create product. Error:${err}`);
        }
    }
    async products_by_category(category) {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM products WHERE category=($1)";
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Couldn't get products by category ${category}. Error:${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
