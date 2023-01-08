import client from "../client";

export type Order = {
  user_id: Number;
  status: string;
};
export type returnOrder = {
  id: Number;
  user_id: Number;
  status: string;
};

export class OrderStore {
  async index(): Promise<returnOrder[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: Number): Promise<returnOrder> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get order with id ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<returnOrder> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO orders(user_id, status) VALUES ($1, $2) RETURNING *";
      const result = await conn.query(sql, [order.user_id, order.status]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    }
  }

  async current_order_by_user(user_id: Number): Promise<returnOrder> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='current'";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Couldn't get current order for user with user_id ${user_id}. Error: ${err}`
      );
    }
  }

  async completed_orders_by_user(user_id: Number): Promise<returnOrder[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM orders WHERE user_id=($1) AND status='completed'";
      const result = await conn.query(sql, [user_id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Couldn't get order completed by user with user_id ${user_id}. Error: ${err}`
      );
    }
  }
  async delete_table(): Promise<void> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM orders";
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete users. Error: ${err}`);
    }
  }
}
