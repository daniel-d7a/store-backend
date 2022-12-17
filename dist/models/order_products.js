"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderProductsStore = void 0;
const client_1 = __importDefault(require("../client"));
class OrderProductsStore {
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
}
exports.OrderProductsStore = OrderProductsStore;
