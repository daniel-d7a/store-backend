import express, { Request, Response, NextFunction } from "express";
import { OrderStore } from "../models/orders";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new OrderStore();

const main = (app: express.Application) => {
  app.get("/orders/current", verifyAuthToken, current_order);
  app.get("/orders/complete", verifyAuthToken, complete_order);
};

const current_order = async (req: Request, res: Response) => {
  try {
    const orders = await store.current_order_by_user(parseInt(req.body.id))
    res.json(orders)
  } catch (err) {
    res.status(404).json(err)
  }
}

const complete_order = async (req: Request, res: Response) => {
  try {
    const orders = await store.completed_orders_by_user(parseInt(req.body.id))
    res.json(orders)
  } catch (err) {
    res.status(404).json(err)
  }
  
}

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
