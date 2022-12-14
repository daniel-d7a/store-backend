import client from "../client";
import { Product } from "./products";

export class DataBaseQuery {
  async most_popular(count: number): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM order_products GROUP BY product_id ORDER BY quantity DESC LIMIT ($1)";
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
