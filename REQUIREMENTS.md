# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
<!-- - Index 'Products' [GET] -->
<!-- - Show 'Products/:id' [GET] -->
<!-- - Create [token required] 'Products' [POST] -->
<!-- - [OPTIONAL] Top 5 most popular products 'Products/most-popular?n=5' [GET] -->
<!-- - [OPTIONAL] Products by category (args: product category) 'Products/category?category=product-category' [GET] -->

#### Users
<!-- - Index [token required] 'Users' [GET] -->
<!-- - Show [token required] 'Users/:id' [GET] -->
<!-- - Create N[token required] 'Users' [POST] -->

#### Orders
<!-- - Current Order by user (args: user id)[token required] 'Orders?user=user-id' [GET] -->
<!-- - [OPTIONAL] Completed Orders by user (args: user id)[token required] 'Orders/completed?user=user-id' [GET]' -->

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

Table: Products(
  id: SERIAL PRIMARY KEY,
  product_name: VARCHAR,
  price: DECIMAL,
  category: VARCHAR
)

#### User
- id
- firstName
- lastName
- password

Table: Users(
  id: SERIAL PRIMARY KEY,
  firstName: VARCHAR,
  lastName: VARCHAR,
  password_digist: VARCHAR
)


#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

Table: Orders(
  id: SERIAL PRIMARY KEY,
  user_id: BIGINT [foreign key to users table],
  status: VARCHAR
)

Table: Order_products(
  id: SERIAL PRIMARY KEY,
  product_id: BIGINT [refernces products table],
  order_id: BIGINT [refernces orders table],
  quantity: INTEGER,
)

