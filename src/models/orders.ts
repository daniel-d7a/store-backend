import client from "../client";

export type Order = {
  id: number;
  user_id: number;
  status: string;
  //TODO: turn status into an enum
  // comments are in cursive oh lala
};

export class OrderStore {
  async index(): Promise<Order[]> {
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

  async show(id: number): Promise<Order> {
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

  async create(order: Order): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "INSERT INTO orders(user_id, status) VALUES ($1, $2) RETURNING *"
      const result = await conn.query(sql, [order.user_id, order.status]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create order. Error: ${err}`);
    }
  }

  async current_order_by_user(id: number): Promise<Order> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1) AND status=current";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(
        `Couldn't get current order for user with id ${id}. Error: ${err}`
      );
    }
  }

  async completed_orders_by_user(id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE id=($1) AND status=completed";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(
        `Couldn't get order completed by user with id ${id}. Error: ${err}`
      );
    }
  }
}
