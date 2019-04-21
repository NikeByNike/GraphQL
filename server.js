const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");

const isAuth = require("./middleware/is-auth");
const GraphQL_Schema = require("./graph_ql/schema/_index");
const GraphQL_Value = require("./graph_ql/resolvers/_index");
const db = require('./db');

const app = express();

app.use(isAuth);

app.use(bodyParser.json());

app.use(
  "/api",
  expressGraphQL({
    schema: GraphQL_Schema,
    rootValue: GraphQL_Value,
    graphiql: true
  })
);

app.get("/", (req, res, next) => {
  res.send("server powered by GraphQL");
});

const port = process.env.Port || 3000;

const server = http.createServer(app);

const url = 'mongodb://localhost:27017/graphQL';

db.connect(url, (err) => {
  if (err) {
    return console.log(err);
  }
  server.listen(port,() => {
    console.log(`App listening on port ${port}!`);
  });
});
