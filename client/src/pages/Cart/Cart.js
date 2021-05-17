import React, { useContext, useEffect } from "react";

import ProductsList from "../../shared/ui/Products-List/Products-List";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";
import Error from "../../shared/ui/Error/Error";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";
import { useItemsPerPage } from "../../shared/hooks/items-pre-row/items-per-row";

function Cart() {
  const { redirectHandler } = useRedirect();
  const { sendRequest, data, dataChangeHandler, isLoading } = useHttp();
  const { itemsPerRow } = useItemsPerPage();
  const { errorText } = useContext(ErrorContext);

  // send a request to the server side

  useEffect(() => {
    if (Object.getOwnPropertyNames(data).length === 0) {
      (async () => {
        try {
          const { cart } = queries;
          const query = cart.bind(queries);
          await sendRequest({ body: query() });
        } catch (error) {}
      })();
    }
  }, [sendRequest, data]);

  return (
    <>
      <Error />

      {Object.getOwnPropertyNames(data).length > 0 && !errorText && (
        <section className="w-max-1080 m-auto position-relative cart-section">
          <div className="container-fluid px-3">
            {data.cart.products.length > 0 ? (
              <ul className="mb-4">
                <ProductsList
                  products={data.cart.products}
                  itemPerRow={itemsPerRow}
                  removeFromCart={true}
                  redirectHandler={redirectHandler}
                  dataChangeHandler={dataChangeHandler}
                />
              </ul>
            ) : (
              <h3>There is no products in cart</h3>
            )}

            <hr />

            <div className="row px-3">
              <div className="col px-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h5 className="mb-1">Total products: {data.cart.totalProducts}</h5>
                    <h5>Total price: ${data.cart.totalPrice}</h5>
                  </div>

                  <div>
                    <button
                      type="button"
                      className={`${
                        data.cart.products.length > 0
                          ? "btn btn-outline-primary"
                          : "btn btn-outline-secondary"
                      }`}
                      disabled={data.cart.products.length === 0}
                    >
                      Go to payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {isLoading && <Spinner />}
    </>
  );
}

export default Cart;
