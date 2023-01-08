import client from "../client";
import { return_order_products } from "./order_products";

export class DataBaseQuery {
  async most_popular(count: Number): Promise<return_order_products[]> {
    try {
      const conn = await client.connect();
      const sql = `SELECT quantity, product_id
        FROM order_products
        GROUP BY quantity, product_id
        ORDER BY quantity DESC LIMIT ($1)`;
      const result = await conn.query(sql, [count]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Couldn't get ${count} most popular products. Error:${err}`
      );
    }
  }
}
