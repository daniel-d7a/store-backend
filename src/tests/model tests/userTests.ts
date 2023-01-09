import { User, UserStore } from "../../models/user";

describe("testing user model", () => {
  let store: UserStore;

  beforeEach(async () => {
    store = new UserStore();

    await store.create({
      firstName: "user1",
      lastName: "lastname1",
      password: "password1",
    });
    await store.create({
      firstName: "user2",
      lastName: "lastname2",
      password: "password2",
    });
  });

  afterEach(async () => {
    await store.delete_table();
  });

  it("tests creating a user", async () => {
    const newUser: User = {
      firstName: "eyad",
      lastName: "alsherif",
      password: "test_password",
    };

    await store.create(newUser);

    const users = await store.index();

    expect(users.length).toBe(3);
  });

  it("tests indexing the users", async () => {
    const users = await store.index();

    expect(users.length).toBe(2);
  });

  it("tests showing a user with a specific id", async () => {
    const users = await store.index();

    const user = await store.show(users[0].id);
    expect(user.firstname).toBe("user1");
  });
});
