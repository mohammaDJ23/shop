import React, { useState, useContext } from "react";

import AuthInputs from "../../components/Auth-components/Auth-Inputs/Auth-Inputs";
import { useFormValidation } from "../../shared/hooks/form-validation/form-validation";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import Error from "../../shared/ui/Error/Error";
import { queries } from "../../shared/utils/queries/queries";
import { routes } from "../../shared/utils/routes/routes";
import { LoginContext } from "../../shared/context/login/login";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { formValidation, inputs, formValidationHandler, formSwitch } = useFormValidation();
  const { sendRequest, isLoading } = useHttp();
  const { redirectHandler } = useRedirect();
  const { loginHandler } = useContext(LoginContext);
  const { errorText } = useContext(ErrorContext);

  // form switch handler

  const formSwitchHandler = () => {
    formSwitch({ isLogin });
    setIsLogin(prevState => !prevState);
  };

  const defineQueryAndRedirectHandler = () => {
    const { name, email, password } = inputs;
    const { signup, login } = queries;

    let query;
    let redirect;

    switch (isLogin) {
      // if the user is in the login page

      case true: {
        query = login.bind(queries, {
          email: email.value,
          password: password.value
        });

        redirect = redirectHandler;
        break;
      }

      // if the user is in the signup page

      case false: {
        query = signup.bind(queries, {
          name: name.value,
          email: email.value,
          password: password.value
        });

        redirect = formSwitchHandler;
        break;
      }

      default: {
        throw new Error("Invalid case.");
      }
    }

    return { query, redirect };
  };

  // send data to the server

  const onSubmitHandler = async e => {
    e.preventDefault();
    const { home } = routes();

    // query and redirect method is diffrent based on isLogin state

    const { query, redirect: redirectHandler } = defineQueryAndRedirectHandler();

    try {
      const userData = await sendRequest({ body: query() });

      if (typeof redirectHandler === "function" && isLogin) {
        const { login } = userData;
        loginHandler({ ...login });
      }

      redirectHandler({ path: home });
    } catch (error) {}
  };

  return (
    <>
      <Error />

      {!errorText && (
        <section className="w-max-600 m-auto pt-2">
          <div className="container-fluid">
            <div className="row px-3">
              <div className="col px-0 align-self-center">
                <div className="border p-3">
                  <form onSubmit={onSubmitHandler}>
                    <AuthInputs isLogin={isLogin} formValidationHandler={formValidationHandler} />

                    <div className="d-flex">
                      <button type="submit" className="btn btn-primary mr-2" disabled={!formValidation}>
                        Submit
                      </button>

                      <button type="button" className="btn btn-outline-primary" onClick={formSwitchHandler}>
                        {isLogin ? "Switch to Signup" : "Switch to Login"}
                      </button>

                      {isLoading && <Spinner className="ml-2" />}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Auth;
