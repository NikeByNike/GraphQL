const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressGraphQL = require("express-graphql");
const graphQL = require("graphql");
const bcrypt = require("bcryptjs");
const db = require('./db');
const Event = require("./models/event").Event;
const User = require("./models/user").User;

const app = express();

app.use(bodyParser.json());

const getEvents = eventsIds => {
  return Event.find({_id:{$in: eventsIds}})
    .then(events => {
      return events.map(event => ({
        ...event._doc,
        creator: getUser.bind(this, event.creator)
      }))
    })
    .catch(err => {throw err});
};

const getUser = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        createdEvents: getEvents.bind(this, user.createdEvents)
      }
    })
    .catch(err => {throw err});
};

app.use(
  "/api",
  expressGraphQL({
    schema: new graphQL.buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      user: String
    }
    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]!
    }
    input UserInput {
      email: String!
      password: String!
    }
    type RootQuery {
      events: [Event!]!
      users: [User!]!
    }
    type RootMutation {
      createEvent(event:EventInput): Event
      createUser(user:UserInput): User
      clear: Boolean
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => ({
              ...event._doc,
              creator: getUser.bind(this, event.creator)
            }));
          })
          .catch(err => {throw err});
      },
      users: () => {
        return User.find()
          .then(users => {
            return users.map(user => ({
                ...user._doc,
                createdEvents: getEvents.bind(this, user.createdEvents)
              }));
          })
          .catch(err => {throw err});
      },
      createEvent: (props) => {
        let user;
        let event;
        return User.findOne({email: props.event.user})
          .then(FindUser => {
            if (!FindUser) {
              throw new Error("User not found")
            }
            user = FindUser;
            const newEvent = new Event({
              title: props.event.title,
              description: props.event.description,
              price: +props.event.price,
              date: new Date(),
              creator: FindUser.id
            });
            return newEvent.save()
          })
          .then(data => {
            event = data._doc;
            user.createdEvents.push(data.id);
            return user.save()
          })
          .then(data => {
            return event;
          })
          .catch(err => {throw err});
      },
      createUser: ({ user }) => {
        return User.findOne({email: user.email}).then(findUser => {
          if (findUser) {
            throw new Error("User exist");
          }
          return bcrypt.hash(user.password, 12)
        }).then(hash => {
            const newUser = new User({
              email: user.email,
              password: hash,
            });
            return newUser.save()
              .then(data => {
                return {...data._doc, password: null};
              })
              .catch(err => {throw err});
          })
          .catch(err => {throw err});
      },
      clear: () => {
        return User.deleteMany({})
          .then(data => {
            return Event.deleteMany({})
          })
          .then(data => {
            return true
          })
          .catch(err => {throw err});
      }
    },
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
