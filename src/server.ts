import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { Product, ProductStore } from './models/products'

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

app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})
