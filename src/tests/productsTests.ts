import { Product, ProductStore } from "../models/products";

describe("testing products model", () => {
  let store: ProductStore;

  beforeEach(async () => {
    store = new ProductStore();

    await store.create({
      price: 1200,
      product_name: "gaming mouse",
      category: "gaming"
    });
    await store.create({
      price: 3500,
      product_name: "samsung buds+",
      category: "earbuds",
    });
  });

  afterEach(async () => {
    await store.delete_table();
  });

  it("tests creating a product", async () => {
    const newProduct: Product = {
      price: 1000,
      product_name: "hp monitor",
      category: "monitor",
    };

    await store.create(newProduct);

    const products = await store.index();

    expect(products.length).toBe(3);
  });

  it("tests indexing the products", async () => {
    const products = await store.index();

    expect(products.length).toBe(2);
  });

  it("tests showing a product with a specific id", async () => {
    const products = await store.index();
    const product = await store.show(products[0].id);

    expect(product.product_name).toBe("gaming mouse");
  });
  
  it("tests showing products with a specific category", async () => {
    const products = await store.products_by_category("gaming");

    expect(products[0].category).toBe("gaming");
  });
});
