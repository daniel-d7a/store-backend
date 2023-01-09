## how to start the project

1. create a user

```
CREATE USER postgres WITH PASSWORD 'dodomax12345';
```

2. create the databases

```
CREATE DATABSE udacity-project;
CREATE DATABSE udacity-project-test;
```

3. grant all priviliges to user in both databases

```
GRANT ALL PREVILGIES ON DATABASE postgres TO udacity-project;
GRANT ALL PREVILGIES ON DATABASE postgres TO udacity-project-test;
```

4. install dependencies

```
npm i
```

5. run all migrations

```
db-migrate up
```

6. run project

```
npm run start
```


## enviromental variables
```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=udacity-project
POSTGRES_TEST_DB=udacity-project-test
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dodomax12345
PORT=3000
BCRYPT_PASSWORD=secret-password123
SALT_ROUNDS=10
ENV=dev
TOKEN_SECRET=secret-token
```