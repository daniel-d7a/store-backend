import express, { Request, Response } from "express";
import { DataBaseQuery } from "../models/miscQueries";
import dotenv from "dotenv";

dotenv.config();

const store = new DataBaseQuery();



const main = (app: express.Application) => {
  app.get("/most_popular_products", most_popular_products);
};

const most_popular_products = async (req: Request, res: Response) => {
  try {
    const products = await store.most_popular(parseInt(req.body.count));
    res.json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};

export default main;
