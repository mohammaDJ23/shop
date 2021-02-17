import React, { createContext, useState, useCallback } from "react";

// login context

export const LoginContext = createContext({
  isLogin: false,
  _id: "",
  name: "",
  token: "",
  expirationDate: "",
  loginHandler: () => {},
  logoutHandler: () => {}
});

// login context provider

function LoginContextProvider({ children }) {
  // state

  const [{ isLogin, _id, name, token, expirationDate }, setLogin] = useState({
    isLogin: false,
    _id: "",
    name: "",
    token: "",
    expirationDate: ""
  });

  // save the user data after login in the local storage

  const loginHandler = useCallback(({ _id, name, token, newExpirationDate }) => {
    // expiration time for data in local storage

    const expirationDate =
      newExpirationDate || new Date(new Date().getTime() + 1000 * 60 * 55);

    const data = { _id, name, token, expirationDate: expirationDate.toISOString() };
    const parsedData = JSON.stringify(data);
    localStorage.setItem("userData", parsedData);
    setLogin({ isLogin: true, _id, name, token, expirationDate });
  }, []);

  // logout handler

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("userData");
    setLogin({ isLogin: false, _id: "", name: "", token: "", expirationDate: "" });
  }, []);

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        _id,
        name,
        token,
        expirationDate,
        loginHandler,
        logoutHandler
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginContextProvider;
