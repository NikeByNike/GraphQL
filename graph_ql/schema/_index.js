const {buildSchema} = require("graphql");

module.exports = buildSchema(`
    type Booking {
      _id: ID!
      event: Event!
      user: User!
      createdAt: String!
      updatedAt: String!
    }
    input BookingInput {
      eventId: ID!
      user: String!
    }
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
    }
    type User {
      _id: ID!
      email: String!
      createdEvents: [Event!]!
    }
    input UserInput {
      email: String!
      password: String!
    }
    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }
    type RootQuery {
      bookings: [Booking!]!
      events: [Event!]!
      users: [User!]!
      login(email: String!, password: String!): AuthData!
    }
    type RootMutation {
      createEvent(event:EventInput): Event
      createUser(user:UserInput): User
      bookEvent(booking: BookingInput): Booking!
      cancelBooking(bookingId: ID!): Event!
      clear: Boolean
      clearEvents: Boolean
      clearBookings: Boolean
    }
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `);