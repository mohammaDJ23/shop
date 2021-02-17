import React, { memo } from "react";

import Input from "../../../shared/ui/Input/Input";
import { rules } from "../../../shared/utils/validations/validations";

function AuthInputs({ isLogin, formValidationHandler }) {
  const {
    minLength,
    maxLength,
    isEmail,
    isPassword,
    require,
    isAlphanumeric
  } = rules();

  return (
    <>
      {!isLogin && (
        <Input
          formValidationHandler={formValidationHandler}
          name="name"
          label="Name"
          type="text"
          id="name"
          placeholder="Enter name"
          className="form-control"
          errorText="Please enter a valid name"
          rules={{ rules: [minLength, isAlphanumeric], minNum: 3, maxNum: 20 }}
          isFile={false}
        />
      )}

      <Input
        formValidationHandler={formValidationHandler}
        name="email"
        label="Email"
        type="email"
        id="email"
        placeholder="Enter email"
        className="form-control"
        errorText="Please enter a valid email"
        rules={{ rules: [require, maxLength, isEmail], maxNum: 50 }}
        isFile={false}
      />

      <Input
        formValidationHandler={formValidationHandler}
        name="password"
        label="Password"
        type="password"
        id="password"
        placeholder="Enter password"
        className="form-control"
        errorText="Please enter a valid password"
        isFile={false}
        rules={{
          rules: [isPassword, minLength, maxLength],
          maxNum: 40,
          minNum: 6
        }}
      />
    </>
  );
}

export default memo(AuthInputs);
