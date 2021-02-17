const fs = require("fs");
const path = require("path");

module.exports = ({ imageUrl }) => {
  fs.unlink(path.join(__dirname, "../..", imageUrl), err => {
    if (err) {
      throw {
        message: "could not delete the prior image of the product."
      };
    }
  });
};
