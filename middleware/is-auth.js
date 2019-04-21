const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get('token');
  if (!authHeader || authHeader === "") {
   req.isAuth = false;
   return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(authHeader, process.env.TOKEN_KEY);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
};