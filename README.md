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
