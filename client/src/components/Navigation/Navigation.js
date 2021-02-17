import React, { useContext } from "react";

import { LoginContext } from "../../shared/context/login/login";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import { routes } from "../../shared/utils/routes/routes";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";

import "./Navigation.css";

function Navigation() {
  const { sendRequest } = useHttp();
  const { redirectHandler } = useRedirect();
  const { isLogin, _id, logoutHandler } = useContext(LoginContext);
  const { home, cart, profile, auth } = routes();

  const authHandler = async () => {
    redirectHandler({ path: auth });

    if (isLogin) {
      logoutHandler();

      try {
        const { deleteCart } = queries;
        const query = deleteCart.bind(queries);
        await sendRequest({ body: query() });
      } catch (error) {}
    }
  };

  return (
    <nav className="position-fixed w-100 bg-light lt-0 py-3 z-5 opacity-09">
      <div className="container-fluid w-max-1080">
        <div className="row px-3">
          <div className="col px-0">
            <ul className="d-flex align-items-center">
              <li className="mr-3 hover">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="currentColor"
                  className="bi bi-bag-plus"
                  viewBox="0 0 16 16"
                  onClick={e => redirectHandler({ path: home })}
                >
                  <path
                    fillRule="evenodd"
                    d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                  />
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>
              </li>

              {isLogin && (
                <>
                  <li className="mr-3 hover">
                    <p onClick={e => redirectHandler({ path: cart, id: _id })}>
                      Cart
                    </p>
                  </li>

                  <li className="mr-3 hover">
                    <p onClick={e => redirectHandler({ path: profile, id: _id })}>
                      Profile
                    </p>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="col px-0">
            <div className="d-flex justify-content-end">
              <p className="hover" onClick={authHandler}>
                {isLogin ? "Logout" : "Signup"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
