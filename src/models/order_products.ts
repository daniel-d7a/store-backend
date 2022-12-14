import client from "../client";

export type order_products = {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
}

export class OrderProductsStore{

  async create(order_product:order_products){

    return null;
  }

}