module.exports = function (error, req, res, next) {
  const { message = "something is wrong", code = 500 } = error;
  res.status(code).json({ message });
};
