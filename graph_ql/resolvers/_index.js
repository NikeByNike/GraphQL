const bcrypt = require("bcryptjs");

const Booking = require("../../models/booking").Booking;
const Event = require("../../models/event").Event;
const User = require("../../models/user").User;

const users = require("./users");
const events = require("./events");
const bookings = require("./bookings");

module.exports = {
  ...users,
  ...events,
  ...bookings,
  clear: async () => {
    try {
      await Booking.deleteMany({});
      await Event.deleteMany({});
      await User.deleteMany({});
      return true;
    } catch (err) {throw err}
  },
};
