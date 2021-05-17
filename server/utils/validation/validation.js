const {
  isLength,
  isEmail,
  isNumeric,
  trim,
  isAlphanumeric,
  normalizeEmail,
  isStrongPassword,
  toFloat
} = require("validator").default;

module.exports = function ({ inputs }) {
  const { name = "", email = "", password = "", productName = "", price = "", description = "" } = inputs;

  const isEmpty = [];

  Object.keys(inputs).forEach(input => {
    switch (input) {
      // check name validation

      case "name":
        const newName = trim(name);

        const isNameValid = isLength(newName, { min: 3, max: 20 }) && isAlphanumeric(newName);

        !isNameValid &&
          isEmpty.push({
            message: "Name is invalid, it should be between 3 - 20 characters and alphanumric.",

            code: 422
          });

        break;

      // check email validation

      case "email":
        const newEmail = trim(email);

        const isEmailValid =
          isLength(newEmail, { min: 1, max: 50 }) &&
          /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(
            newEmail
          ) &&
          normalizeEmail(newEmail);

        !isEmailValid &&
          isEmpty.push({
            message: "Email is invalid, it should be between 1 - 50 characters and a valid email.",

            code: 422
          });

        break;

      // check password validation

      case "password":
        const newPassword = trim(password);

        const isPasswordValid =
          isLength(newPassword, { min: 6, max: 40 }) &&
          isStrongPassword(newPassword, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          });

        !isPasswordValid &&
          isEmpty.push({
            message:
              "Password is invalid, it should have 6 - 40 length and contain lowercase, uppercase, symbole letter and number.",

            code: 422
          });

        break;

      // check product name validation

      case "productName":
        const newProductName = trim(productName);

        const isProductNameValid =
          isLength(newProductName, { min: 3, max: 30 }) && isAlphanumeric(newProductName);

        !isProductNameValid &&
          isEmpty.push({
            message: "Product name is invalid, it should be between 3 - 30 characters and alphanumric.",

            code: 422
          });

        break;

      // check price validation

      case "price":
        const newPrice = toFloat(trim(price.toString()));

        const isPriceValid = isNumeric(price.toString()) && newPrice > 0 && newPrice <= 1000;

        !isPriceValid &&
          isEmpty.push({
            message: "Price is invalid, it should be a number and between 0 - 1000.",
            code: 422
          });

        break;

      // check decription validation

      case "description":
        const newDescription = trim(description);
        const isDescriptionValid = isLength(newDescription, { min: 10, max: 100 });

        !isDescriptionValid &&
          isEmpty.push({
            message: "description is invalid, it should be between 10 - 100 characters.",

            code: 422
          });

        break;

      case "imageUrl":
        break;

      case "id":
        break;

      case "pathname":
        break;

      // if the input name is invalid

      default:
        isEmpty.push({ message: "Invalid input name" });
    }
  });

  return isEmpty;
};
