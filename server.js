const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const data = [
  { id: 1, name: "Артем", age: 25 },
  { id: 2, name: "Иван", age: 30 },
  { id: 3, name: "Елена", age: 35 },
];

const schema = buildSchema(`
  type Query {
    users: [User]
    user(id: Int!): User
  }

  type User {
    id: Int
    name: String
    age: Int
  }

  type Mutation {
    createUser(name: String!, age: Int!): User
  }
`);

const root = {
  users: () => data,
  user: ({ id }) => data.find((user) => user.id === id),
  createUser: ({ name, age }) => {
    const id = data.length + 1;
    const newUser = { id, name, age };
    data.push(newUser);
    return newUser;
  },
};

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server is running on localhost:4000"));
