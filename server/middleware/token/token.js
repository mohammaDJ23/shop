const jwt = require("jsonwebtoken");

const jwtKey = require("../../utils/jwt-key/jwt-key");

module.exports = function ({ req }) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw "something is wrong.";
    }

    const decodedToken = jwt.verify(token, jwtKey());
    return decodedToken || false;
  } catch (error) {
    return false;
  }
};
