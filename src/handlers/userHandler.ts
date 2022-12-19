import express, { Request, Response, NextFunction } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new UserStore();

const main = (app: express.Application) => {
  app.get("/User", verifyAuthToken, index);
  app.get("/User/:id", verifyAuthToken, show);
  app.post("/User", verifyAuthToken, create);
};

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(404).json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(404).json(err);
  }
};
const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      firstName: req.body.firstname,
      lastName: req.body.lastName,
      password: req.body.firstname,
    };

    const newUser = await store.create(user);

    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string
    );

    res.json(token);
  } catch (err) {
    res.status(404).json(err);
  }
};


const verifyAuthToken = (req: Request, res: Response, next:NextFunction) => {
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