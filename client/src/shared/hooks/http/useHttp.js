import { useCallback, useRef, useState, useEffect, useContext } from "react";

import { ErrorContext } from "../../context/error/error";
import { LoginContext } from "../../context/login/login";
import { queries } from "../../utils/queries/queries";
import { cases } from "../../utils/cases/cases";

export function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const abortHttpRequest = useRef([]);
  const { errorHandler } = useContext(ErrorContext);
  const { token } = useContext(LoginContext);

  const {
    ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT,
    ADD_PRODUCT_TO_CART_BUTTON_HOME,
    DELETE_PRODUCT,
    REMOVE_PRODUCT_FROM_CART_BUTTON_CART
  } = cases;

  // send a request to the server side

  const sendRequest = useCallback(
    async ({
      url = process.env.REACT_APP_GRAPHQL_URL,
      method = "POST",
      body,
      headers = { Authorization: `Bearer ${token}` },
      isMore = false
    } = {}) => {
      let { current: abortRequest } = abortHttpRequest;

      // create the aborter requrest

      const abortController = new AbortController();
      abortRequest.push(abortController);

      try {
        if (!isMore) {
          setIsLoading(true);
        }

        // check if data just was a plain object

        if (!(body instanceof FormData)) {
          body = JSON.stringify(body);

          headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          };
        }

        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortController.signal
        });

        const responseData = await response.json();

        // after receive the response doesn't need to abort request

        abortRequest = abortRequest.filter(reqCtrl => reqCtrl !== abortController);

        // error handling

        if (!response.ok) {
          throw new Error(responseData.message || responseData.errors[0].message);
        }

        if (!isMore) {
          setData(responseData.data);
        }

        return responseData.data;
      } catch (error) {
        if (error.message.indexOf("The user aborted a request.") === -1) {
          errorHandler(error.message);
        }

        throw error;
      } finally {
        if (!isMore) {
          setIsLoading(false);
        }
      }
    },
    [errorHandler, token]
  );

  // abort the request

  useEffect(() => {
    let { current: abortRequest } = abortHttpRequest;
    return () => abortRequest.forEach(abortCtrl => abortCtrl.abort());
  }, []);

  // data modification handler

  const dataModificationHandler = useCallback(
    ({ action, index }) => {
      let newData = {};

      switch (action) {
        // if the user was in home page and cliked on the add to card button

        case ADD_PRODUCT_TO_CART_BUTTON_HOME:
          newData = { ...data };
          newData["home"][index]["addToCart"] = !newData["home"][index]["addToCart"];

          break;

        // if the user was in the cart page and wanted to remove the prodcut from card

        case REMOVE_PRODUCT_FROM_CART_BUTTON_CART:
          newData = { ...data };
          const product = newData["cart"]["products"].splice(index, 1);
          newData["cart"]["totalProducts"] = +newData["cart"]["totalProducts"] - 1;
          newData["cart"]["totalPrice"] = +newData["cart"]["totalPrice"] - +product[0]["price"];

          break;

        // add ro remove product from cart (from single product page)

        case ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT:
          newData = { ...data };
          newData["product"]["addToCart"] = !newData["product"]["addToCart"];

          break;

        // delete product

        case DELETE_PRODUCT:
          newData = { ...data };
          newData["profile"]["products"].splice(index, 1);
          newData["profile"]["totalProducts"] = +newData["profile"]["totalProducts"] - 1;

          break;

        // default value should thorw an error

        default:
          throw new Error("Invalid case.");
      }

      setData(newData);
    },
    [
      data,
      ADD_PRODUCT_TO_CART_BUTTON_HOME,
      ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT,
      REMOVE_PRODUCT_FROM_CART_BUTTON_CART,
      DELETE_PRODUCT
    ]
  );

  // add or remove prodcut from cart in home or cart page or delete
  // product from profile page (more request)

  const dataChangeHandler = useCallback(
    async ({ id, index, action }) => {
      try {
        dataModificationHandler({ index, action });
        const { addOrRemoveProductFromCart, deleteProduct } = queries;
        let query;

        switch (action) {
          // select add or remove the product from cart query

          case ADD_PRODUCT_TO_CART_BUTTON_HOME:
          case REMOVE_PRODUCT_FROM_CART_BUTTON_CART:
          case ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT:
            query = addOrRemoveProductFromCart.bind(queries, { id });

            break;

          // select the delete product query

          case DELETE_PRODUCT:
            query = deleteProduct.bind(queries, { id });

            break;

          default:
            throw new Error("Invalid case.");
        }

        await sendRequest({ body: query(), isMore: true });
      } catch (error) {}
    },
    [
      dataModificationHandler,
      sendRequest,
      ADD_PRODUCT_TO_CART_BUTTON_HOME,
      REMOVE_PRODUCT_FROM_CART_BUTTON_CART,
      DELETE_PRODUCT,
      ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT
    ]
  );

  return { isLoading, data, sendRequest, dataChangeHandler };
}
