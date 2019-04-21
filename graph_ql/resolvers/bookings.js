const Booking = require("../../models/booking").Booking;
const User = require("../../models/user").User;

const {transformBooking, transformEvent} = require("./~transform");

module.exports = {
  bookings: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => (transformBooking(booking)));
    } catch (err) {throw err}
  },
  bookEvent: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const FindUser = await User.findById(req.userId);
      if (!FindUser) {
        throw new Error("User not found");
      }
      const FindEvent = await Event.findOne({ _id: props.booking.eventId });
      if (!FindEvent) {
        throw new Error("Event not found");
      }
      const newBooking = new Booking({
        event: FindEvent.id,
        user: FindUser.id
      });
      const data = await newBooking.save();
      return transformBooking(data);
    } catch (err) {throw err}
  },
  cancelBooking: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const findBooking = await Booking.findById(props.bookingId).populate("event");
      if (!findBooking) {
        throw new Error("Booking not found")
      }
      await Booking.deleteOne({_id: props.bookingId});
      return transformEvent(findBooking.event._doc);
    } catch (err) {throw err}
  },
  clearBookings: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      await Booking.deleteMany({});
      return true;
    } catch (err) {throw err}
  }
};