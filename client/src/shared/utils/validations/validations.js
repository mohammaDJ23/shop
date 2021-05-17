import isAlphanumeric from "is-alphanumeric";

// initial rules

export function rules() {
  return {
    minLength: "MIN_LENGTH",
    maxLength: "MAX_LENGTH",
    require: "REQUIRE",
    isEmail: "IS_EMAIL",
    isPassword: "IS_PASSWORD",
    minPrice: "MIN_PRICE",
    isFile: "IS_FILE",
    isAlphanumeric: "IS_ALPHANUMERIC"
  };
}

// validation logic

export function validation({ rules: requiredRules, value, minNum = 1, maxNum = 30 }) {
  let isValid = true;

  const {
    minLength,
    maxLength,
    require,
    isEmail,
    isPassword,
    minPrice,
    isFile,
    isAlphanumeric: isAlphanum
  } = rules();

  for (const rule of requiredRules) {
    switch (rule) {
      // min length check

      case isAlphanum: {
        isValid = isValid && isAlphanumeric(value.trim());
        break;
      }

      case minLength: {
        isValid = isValid && value.trim().length >= minNum;
        break;
      }

      // max length check

      case maxLength: {
        isValid = isValid && value.trim().length <= maxNum;
        break;
      }

      // require check

      case require: {
        isValid = isValid && value.trim().length > 0;
        break;
      }

      // to check does value have email schema

      case isEmail: {
        isValid =
          isValid &&
          /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/.test(
            value.trim()
          );
        break;
      }

      // password check

      case isPassword: {
        isValid = isValid && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(value.trim());

        break;
      }

      // min price should be 1 and max is 1000

      case minPrice: {
        const number = Number(value.trim()).toFixed(2);
        isValid = isValid && number > 0 && number <= 1000;
        break;
      }

      // check for is file valid

      case isFile: {
        isValid = isValid && !!value;
        break;
      }

      default: {
        throw new Error("Invalid case.");
      }
    }
  }

  return isValid;
}
