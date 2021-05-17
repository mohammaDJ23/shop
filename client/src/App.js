import React, { lazy, Suspense, useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import Navigation from "./components/Navigation/Navigation";
import Spinner from "./shared/ui/Spinner/Spinner";
import { routes } from "./shared/utils/routes/routes";
import { LoginContext } from "./shared/context/login/login";
import { useHttp } from "./shared/hooks/http/useHttp";
import { queries } from "./shared/utils/queries/queries";

const HomePage = lazy(() => import("./pages/Home/Home"));
const AddProductPage = lazy(() => import("./pages/Add-Product/Add-Product"));
const AuthPage = lazy(() => import("./pages/Auth/Auth"));
const CartPage = lazy(() => import("./pages/Cart/Cart"));
const ProfilePage = lazy(() => import("./pages/Profile/Profile"));
const ProductPage = lazy(() => import("./pages/Product/Product"));

let timer;

function App() {
  const { isLogin, expirationDate, loginHandler, logoutHandler } = useContext(LoginContext);

  const { sendRequest } = useHttp();

  const { home, createProduct, updateProduct, auth, cart, product, profile } = routes();

  // when the user left form our application without logout
  // then remember the user

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const parsedUserData = JSON.parse(userData);

    if (parsedUserData && parsedUserData.token && new Date(parsedUserData.expirationDate) > new Date()) {
      const { _id, token, name, expirationDate } = parsedUserData;

      loginHandler({
        _id,
        token,
        name,
        newExpirationDate: new Date(expirationDate)
      });
    }
  }, [loginHandler]);

  // if the user logedin and had an expirationDate,
  // trigger logout with setTimeout and with expirationDate as its time

  useEffect(() => {
    if (isLogin && expirationDate) {
      const expiration = expirationDate.getTime() - new Date().getTime();

      timer = setTimeout(async () => {
        if (isLogin) {
          logoutHandler();

          try {
            const { deleteCart } = queries;
            const query = deleteCart.bind(queries);
            await sendRequest({ body: query() });
          } catch (error) {}
        } else {
          clearTimeout(timer);
        }
      }, expiration);
    }
  }, [logoutHandler, isLogin, expirationDate, sendRequest]);

  return (
    <Router>
      <Navigation />

      <main className="mt-65">
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route exact path={home} component={HomePage} />
            <Route exact path={auth} component={AuthPage} />

            {isLogin && (
              <>
                <Route exact path={[createProduct, updateProduct]} component={AddProductPage} />
                <Route exact path={cart} component={CartPage} />
                <Route exact path={profile} component={ProfilePage} />
                <Route exact path={product} component={ProductPage} />
              </>
            )}

            <Redirect to={home} />
          </Switch>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
