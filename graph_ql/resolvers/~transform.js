const Event = require("../../models/event").Event;
const User = require("../../models/user").User;

const {dateToString} = require("../../helpers/index");

const getEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {throw err}
};

const getEvents = async eventsIds => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });
    return events.map(event => (transformEvent(event)));
  } catch (err) {throw err}
};

const getUser = async userId => {
  try {
    const user = await User.findById(userId);
    return transformUser(user);
  } catch (err) {throw err}
};

const transformEvent = event => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: getUser.bind(this, event.creator)
  }
};

const transformUser = user => {
  return {
    ...user._doc,
    password: null,
    createdEvents: getEvents.bind(this, user.createdEvents)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    event: getEvent.bind(this, booking._doc.event),
    user: getUser.bind(this, booking._doc.user)
  }
};

exports.transformEvent = transformEvent;
exports.transformUser = transformUser;
exports.transformBooking = transformBooking;