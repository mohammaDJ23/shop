import { useCallback, useReducer } from "react";

import { cases } from "../../utils/cases/cases";

export function useFormValidation() {
  const { CHANGE_FORM_VALIDATION, CHANGE_FORM_VALIDATION_BY_LOGIN_INPUTS } = cases;

  const [{ formValidation, inputs }, dispatch] = useReducer(
    (state, { type, id, value, isInputValid }) => {
      switch (type) {
        // change validation of form

        case CHANGE_FORM_VALIDATION: {
          let formValidation = true;

          if (!state.inputs[id]) {
            state.inputs[id] = { value, isInputValid };
          }

          // loop all input and check formValidation with them

          for (const key in state.inputs) {
            if (key === id) {
              formValidation = isInputValid && formValidation;
            } else {
              formValidation = state.inputs[key]["isInputValid"] && formValidation;
            }
          }

          return {
            ...state,

            inputs: {
              ...state.inputs,

              [id]: {
                ...state.inputs[id],
                value,
                isInputValid
              }
            },

            formValidation
          };
        }

        // if isLogin was true

        case CHANGE_FORM_VALIDATION_BY_LOGIN_INPUTS: {
          return {
            ...state,
            formValidation: isInputValid
          };
        }

        default: {
          throw new Error("Invalid case.");
        }
      }
    },

    // initial state

    {
      inputs: {},
      formValidation: false
    }
  );

  // get data from input file and pass them here to check the validation of form

  const formValidationHandler = useCallback(
    ({ value, id, isInputValid }) => {
      dispatch({ type: CHANGE_FORM_VALIDATION, value, id, isInputValid });
    },
    [CHANGE_FORM_VALIDATION]
  );

  // form switch

  const formSwitch = useCallback(
    ({ isLogin }) => {
      if (!isLogin) {
        for (const key in inputs) {
          // when isLogin is true mean we have email and password inputs,
          // so if there was extra input, then remove it.

          if (!["password", "email"].includes(key)) {
            delete inputs[key];
          }
        }

        // then change formValidation jsut by password and email because,
        // there is not name input in the login form

        dispatch({
          type: CHANGE_FORM_VALIDATION_BY_LOGIN_INPUTS,
          isInputValid: inputs["password"]["isInputValid"] && inputs["email"]["isInputValid"]
        });
      }
    },
    [inputs, CHANGE_FORM_VALIDATION_BY_LOGIN_INPUTS]
  );

  return { formValidation, inputs, formValidationHandler, formSwitch };
}
