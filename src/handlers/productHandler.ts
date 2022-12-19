import express, { Request, Response, NextFunction } from "express";
import { Product, ProductStore } from "../models/products";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new ProductStore();

const main = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.get("/products/category/:category", products_by_category);
};

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};
const show = async (req: Request, res: Response) => {
  try {
    const products = await store.show(parseInt(req.params.id));
    res.json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      price: req.body.price,
      product_name: req.body.name,
      category: req.body.category
    } 

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(404).json(err);
  }
};

const products_by_category = async (req: Request, res: Response) => {
  try {
    const products = await store.products_by_category(req.params.category)
    res.json(products);
  } catch (err) {
    res.status(404).json(err);
  }
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);

    next();
  } catch (error) {
    res.status(401);
  }
};

export default main;
