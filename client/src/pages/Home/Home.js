import React, { useContext, useEffect } from "react";

import ProductsList from "../../shared/ui/Products-List/Products-List";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";
import Error from "../../shared/ui/Error/Error";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";
import { useItemsPerPage } from "../../shared/hooks/items-pre-row/items-per-row";

function Home() {
  const { redirectHandler } = useRedirect();
  const { sendRequest, data, dataChangeHandler, isLoading } = useHttp();
  const { itemsPerRow } = useItemsPerPage();
  const { errorText } = useContext(ErrorContext);

  // send a request to the server

  useEffect(() => {
    if (Object.getOwnPropertyNames(data).length === 0) {
      (async () => {
        try {
          const { home } = queries;
          const query = home.bind(queries);
          await sendRequest({ body: query() });
        } catch (error) {}
      })();
    }
  }, [sendRequest, data]);

  return (
    <>
      <Error />

      {Object.getOwnPropertyNames(data).length > 0 && !errorText && (
        <section className="w-max-1080 m-auto">
          <div className="container-fluid px-3">
            {data.home.length > 0 ? (
              <ul>
                <ProductsList
                  products={data.home}
                  itemPerRow={itemsPerRow}
                  addToCart={true}
                  redirectHandler={redirectHandler}
                  dataChangeHandler={dataChangeHandler}
                />
              </ul>
            ) : (
              <h3>There is no products in here</h3>
            )}
          </div>
        </section>
      )}

      {isLoading && <Spinner />}
    </>
  );
}

export default Home;
