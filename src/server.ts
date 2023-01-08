import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Product, ProductStore } from './models/products'
import userHandler from "./handlers/userHandler"
import productHandler from "./handlers/productHandler";
import ordersHandler from "./handlers/ordersHandler";
import orderProductsHandler from "./handlers/orderProductsHandler";
import queriesHandler from "./handlers/queriesHandler"

const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(bodyParser.json())

app.get('/', async function (_req: Request, res: Response) {

    const productStore = new ProductStore();
    const prod = await productStore.create({
        price: 20,
        product_name: "cook book",
        category: "book",
        id: 1
    } as Product)
    res.send(prod);

})

userHandler(app);
ordersHandler(app);
productHandler(app);
queriesHandler(app);
orderProductsHandler(app);

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
