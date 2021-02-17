import React, { createContext, useState, useCallback, useEffect } from "react";

export const ErrorContext = createContext({
  errorText: "",
  errorHandler: () => {}
});

function ErrorContextProvider({ children }) {
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (errorText) {
      document.body.style.overflow = "hidden";
    }
  }, [errorText]);

  // error handling

  const errorHandler = useCallback(error => setErrorText(error), []);

  return (
    <ErrorContext.Provider value={{ errorText, errorHandler }}>
      {children}
    </ErrorContext.Provider>
  );
}

export default ErrorContextProvider;
