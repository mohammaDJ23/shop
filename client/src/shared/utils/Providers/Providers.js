import React from "react";

import ErrorContextProvider from "../../context/error/error";
import LoginContextProvider from "../../context/login/login";

function Providers({ children }) {
  return (
    <ErrorContextProvider>
      <LoginContextProvider>{children}</LoginContextProvider>
    </ErrorContextProvider>
  );
}

export default Providers;
