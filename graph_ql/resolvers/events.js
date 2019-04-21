const Event = require("../../models/event").Event;
const User = require("../../models/user").User;

const {transformEvent} = require("./~transform");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => (transformEvent(event)));
    } catch (err) {throw err}
  },
  createEvent: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const FindUser = await User.findById(req.userId);
      if (!FindUser) {
        throw new Error("User not found");
      }
      const newEvent = new Event({
        title: props.event.title,
        description: props.event.description,
        price: +props.event.price,
        date: new Date(),
        creator: FindUser.id
      });
      const data = await newEvent.save();
      FindUser.createdEvents.push(data.id);
      await FindUser.save();
      return transformEvent(data);
    } catch (err) {throw err}
  },
  clearEvents: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      await Event.deleteMany({});
      return true;
    } catch (err) {throw err}
  }
};
