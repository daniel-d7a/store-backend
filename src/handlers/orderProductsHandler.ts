import express, { Request, Response, NextFunction } from "express";
import { order_products, OrderProductsStore } from "../models/order_products";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new OrderProductsStore();

const main = (app: express.Application) => {
  app.get("/orders/products", verifyAuthToken, index);
  app.post("/orders/products", verifyAuthToken, add_product);
  app.get("/orders/:id/products", verifyAuthToken, show);
  app.delete(
    "/orders/:order_id/products/:product_id",
    verifyAuthToken,
    delete_product_from_order
  );
};

const index = async (_req: Request, res: Response) => {
  try {
    const orderProducts = await store.index();
    console.log("inside index");
    res.json(orderProducts);
  } catch (err) {
    res.status(404).json(err);
  }
};
const show = async (req: Request, res: Response) => {
  try {
    const orderProducts = await store.show(parseInt(req.params.id));
    console.log("inside show");

    res.json(orderProducts);
  } catch (err) {
    res.status(404).json(err);
  }
};

const add_product = async (req: Request, res: Response) => {
  try {
    const orderProduct: order_products = {
      order_id: req.body.order_id,
      product_id: req.body.product_id,
      quantity: req.body.quantity,
    };

    const newOrderProduct = await store.create(orderProduct);
    res.status(201).json(newOrderProduct);
  } catch (err) {
    res.status(404).json(err);
  }
};
const delete_product_from_order = async (req: Request, res: Response) => {
  try {
    const orderProduct = await store.delete_product(
      parseInt(req.params.order_id),
      parseInt(req.params.product_id)
    );
    res.status(204).json(orderProduct);
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
