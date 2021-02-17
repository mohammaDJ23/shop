const token = require("../../middleware/token/token");

module.exports = function (req, res, next) {
  const isTokenValid = token({ req });

  if (!isTokenValid) {
    const error = new Error("Authentication failed.");
    error.code = 403;
    return next(error);
  }

  if (!req.file) {
    const error = new Error("please pick an image");
    error.code = 422;
    return next(error);
  }

  return res.status(201).json({ data: req.file.path });
};
