const mongoose = require("mongoose");

module.exports = function ({ id }) {
  return mongoose.Types.ObjectId(id);
};
