"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProductsStore = void 0;
const client_1 = __importDefault(require("../client"));
class OrderProductsStore {
    async index() {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM order_products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not create order_products. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await client_1.default.connect();
            const sql = "SELECT * FROM order_products WHERE id=($1)";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not show order_products. Error: ${err}`);
        }
    }
    async create(order_product_param) {
        try {
            const conn = await client_1.default.connect();
            const sql = "INSERT INTO order_products(product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *";
            const result = await conn.query(sql, [
                order_product_param.product_id,
                order_product_param.order_id,
                order_product_param.quantity,
            ]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not create order_products. Error: ${err}`);
        }
    }
    async delete_product(order_id, product_id) {
        try {
            const conn = await client_1.default.connect();
            const sql = "DELETE FROM order_products WHERE order_id=($1) AND product_id=($2)";
            await conn.query(sql, [order_id, product_id]);
            conn.release();
        }
        catch (err) {
            throw new Error(`Could not delete order_products. Error: ${err}`);
        }
    }
    async delete_table() {
        try {
            const conn = await client_1.default.connect();
            const sql = "DELETE FROM order_products";
            await conn.query(sql);
            conn.release();
        }
        catch (err) {
            throw new Error(`Could not delete users. Error: ${err}`);
        }
    }
}
exports.OrderProductsStore = OrderProductsStore;
