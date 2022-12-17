import client from "../client";

export type Product = {
  id: number;
  product_name: string;
  price: number;
  category?: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Couldn't get products. Error:${err}`);
    }
  }
  async show(id: number): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Couldn't get product with id ${id}. Error:${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO products(product_name, price, category) VALUES ($1, $2, $3) RETURNING *";
      const result = await conn.query(sql, [
        product.product_name,
        product.price,
        product.category,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Couldn't create product. Error:${err}`);
    }
  }

  async products_by_category(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category=($1)";
      const result = await conn.query(sql, [category]);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Couldn't get products by category ${category}. Error:${err}`);
    }
  }
}
