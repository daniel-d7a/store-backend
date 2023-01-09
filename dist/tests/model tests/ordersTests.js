"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orders_1 = require("../../models/orders");
const user_1 = require("../../models/user");
describe("testing orders model", () => {
    let store;
    const userStore = new user_1.UserStore();
    beforeAll(async () => {
        await userStore.delete_table();
        await userStore.create({
            firstName: "user1",
            lastName: "lastname1",
            password: "password1",
        });
        await userStore.create({
            firstName: "user2",
            lastName: "lastname2",
            password: "password2",
        });
    });
    beforeEach(async () => {
        store = new orders_1.OrderStore();
        const users = await userStore.index();
        await store.create({
            user_id: users[0].id,
            status: "completed",
        });
        await store.create({
            user_id: users[1].id,
            status: "current",
        });
    });
    afterEach(async () => {
        await store.delete_table();
    });
    afterAll(async () => {
        await userStore.delete_table();
    });
    it("tests creating an order", async () => {
        const users = await userStore.index();
        const newOrder = {
            user_id: users[0].id,
            status: 'cancelled',
        };
        await store.create(newOrder);
        const orders = await store.index();
        expect(orders.length).toBe(3);
    });
    it("tests indexing the orders", async () => {
        const orders = await store.index();
        expect(orders.length).toBe(2);
    });
    it("tests showing an order with a specific id", async () => {
        const orders = await store.index();
        const order = await store.show(orders[0].id);
        expect(order.status).toBe("completed");
    });
    it("tests showing current order by user", async () => {
        const users = await userStore.index();
        const order = await store.current_order_by_user(users[1].id);
        expect(order.status).toBe("current");
    });
    it("tests showing completed order by user", async () => {
        const users = await userStore.index();
        const orders = await store.completed_orders_by_user(users[0].id);
        expect(orders.length).toBe(1);
    });
});
