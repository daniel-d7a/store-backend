import client from "../client";

export type order_products = {
  product_id: number;
  order_id: number;
  quantity: number;
};

export class OrderProductsStore {
  async index() {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM order_products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not create order_products. Error: ${err}`);
    }
  }
  async show(order_id: number) {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT product_id, quantity FROM order_products WHERE order_id=($1)";
      const result = await conn.query(sql, [order_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not create order_products. Error: ${err}`);
    }
  }
  async create(order_product_param: order_products) {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO order_products(product_id, order_id, quantity) VALUES ($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        order_product_param.product_id,
        order_product_param.order_id,
        order_product_param.quantity,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order_products. Error: ${err}`);
    }
  }
  async delete_product(order_id: number, product_id: number) {
    try {
      const conn = await client.connect();
      const sql =
        "DELETE FROM order_products WHERE order_id=($1) AND product_id=($2)";
      const result = await conn.query(sql, [order_id, product_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order_products. Error: ${err}`);
    }
  }
}
