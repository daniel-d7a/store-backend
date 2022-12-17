import client from "../client";

export type order_products = {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
};

export class OrderProductsStore {
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
}
