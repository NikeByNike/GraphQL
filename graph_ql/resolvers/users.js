const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/user").User;

const {transformUser} = require("./~transform");

module.exports = {
  users: async (props, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const users = await User.find();
      return users.map(user => (transformUser(user)));
    } catch (err) {throw err}
  },
  createUser: async props => {
    try {
      const findUser = await User.findOne({ email: props.user.email });
      if (findUser) {
        throw new Error("User exist");
      }
      const hash = await bcrypt.hash(props.user.password, 12);
      const newUser = new User({
        email: props.user.email,
        password: hash
      });
      const data = await newUser.save();
      return { ...data._doc, password: null };
    } catch (err) {throw err}
  },
  login: async ({email, password}) => {
    try {
      const findUser = await User.findOne({email});
      if (!findUser) {
        throw new Error("Data is not valid")
      }
      const isEqule = await bcrypt.compare(password, findUser.password);
      if (!isEqule) {
        throw new Error("Data is not valid")
      }
      const token = jwt.sign({userId: findUser.id, email: findUser.email}, process.env.TOKEN_KEY, {
        expiresIn: "1h"
      });
      return {userId: findUser.id, token: token, tokenExpiration: 1}
    } catch (err) {throw err}
  }
};


