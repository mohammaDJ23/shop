import React, { useReducer, useEffect } from "react";

import { validation } from "../../utils/validations/validations";

function Input({
  name,
  label,
  type,
  id,
  placeholder,
  className,
  isFile,
  rules,
  errorText,
  formValidationHandler
}) {
  // state management.

  const [{ value, isTouch, isInputValid }, dispatch] = useReducer(
    (state, { type, value, validations, isTouch }) => {
      switch (type) {
        // set new value.

        case "CHANGE_VALUE": {
          const { rules, minNum, maxNum } = validations;

          return {
            ...state,
            value: value || state.value,
            isInputValid: validation({ value, rules, minNum, maxNum })
          };
        }

        // set touch out of input to true to show error (if there was an error)

        case "SET_IS_TOUCH": {
          return {
            ...state,
            isTouch: isTouch
          };
        }

        // throw an error if there was not valid case.

        default: {
          throw new Error("Invalid case.");
        }
      }
    },

    // initial state.

    {
      value: isFile ? null || "" : "",
      isInputValid: false,
      isTouch: false
    }
  );

  // on change input handler

  const onChangeHandler = e => {
    let value = e.target.value;

    if (isFile) {
      value = e.target.files?.[0];
    }

    dispatch({ type: "CHANGE_VALUE", value, validations: rules });
  };

  // on blur handler to show error (if there was error) by click out of input box

  const onBlurHandler = () => dispatch({ type: "SET_IS_TOUCH", isTouch: true });

  // get input information to check validation of form

  useEffect(() => {
    formValidationHandler({
      value,
      id,
      isInputValid
    });
  }, [value, id, isInputValid, formValidationHandler]);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <input
        type={type}
        className={`${
          errorText && !isInputValid && isTouch && "btn-outline-danger"
        } ${className && className}`}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChangeHandler}
        onBlur={onBlurHandler}
      />

      {errorText && !isInputValid && isTouch && (
        <p className="text-danger mt-2">{errorText}</p>
      )}
    </div>
  );
}

export default Input;
