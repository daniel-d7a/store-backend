import express, { Request, Response, NextFunction } from "express";
import { DataBaseQuery } from "../models/miscQueries";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new DataBaseQuery();

const main = (app: express.Application) => {
  app.get("products/most_popular", most_popular_products);
};

const most_popular_products = async (req: Request, res: Response) => {
  try {
    const products = await store.most_popular(req.body.count);
    res.json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};

export default main;
