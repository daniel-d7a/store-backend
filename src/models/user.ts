import client from "../client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export type User = {
  firstName: string;
  lastName: string;
  password: string;
};
export type returnUser = {
  id: Number;
  firstname: string;
  lastname: string;
  password_digist: string;
};

export class UserStore {
  async index(): Promise<returnUser[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: Number): Promise<returnUser> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not get user with id ${id}. Error: ${err}`);
    }
  }

  async create(user: User): Promise<returnUser> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users(firstName, lastName, password_digist) VALUES($1, $2, $3) RETURNING *";

      const saltRounds = process.env.SALT_ROUNDS as string;
      const pepper = process.env.BCRYPT_PASSWORD;
      const hashedPassword = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const result = await conn.query(sql, [
        user.firstName,
        user.lastName,
        hashedPassword,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not create user. Error: ${err}`);
    }
  }

  async delete_table(): Promise<void> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users";
      await conn.query(sql);
      conn.release();
    } catch (err) {
      throw new Error(`Could not delete users. Error: ${err}`);
    }
  }
}
