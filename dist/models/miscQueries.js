"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBaseQuery = void 0;
const client_1 = __importDefault(require("../client"));
class DataBaseQuery {
    async most_popular(count) {
        try {
            const conn = await client_1.default.connect();
            const sql = `SELECT quantity, product_id
        FROM order_products
        GROUP BY quantity, product_id
        ORDER BY quantity DESC LIMIT ($1)`;
            const result = await conn.query(sql, [count]);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Couldn't get ${count} most popular products. Error:${err}`);
        }
    }
}
exports.DataBaseQuery = DataBaseQuery;
