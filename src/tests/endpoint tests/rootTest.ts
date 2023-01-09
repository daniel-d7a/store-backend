// import main from "../../handlers/userHandler";
import app from "../../server";

import supertest from "supertest";

describe("testing root handler", () => {
  it("tests the root route", async () => {
    const test = await supertest(app).get("/");

    expect(test.status).toBe(200);
  });
});
