import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import SingleProduct from "../../components/Product-components/Single-Product/Single-Product";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";
import Error from "../../shared/ui/Error/Error";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";

function Product() {
  const { id } = useParams();
  const { errorText } = useContext(ErrorContext);
  const { sendRequest, data, dataChangeHandler, isLoading } = useHttp();
  const { product } = queries;

  // send a request to the server

  useEffect(() => {
    if (Object.getOwnPropertyNames(data).length === 0) {
      (async () => {
        try {
          const query = product.bind(queries, { id });
          await sendRequest({ body: query() });
        } catch (error) {}
      })();
    }
  }, [sendRequest, product, id, data]);

  return (
    <>
      <Error />

      {Object.getOwnPropertyNames(data).length > 0 && !errorText && (
        <section className="w-max-1080 m-auto pt-3">
          <div className="container-fluid">
            <SingleProduct {...data.product} dataChangeHandler={dataChangeHandler} />
          </div>
        </section>
      )}

      {isLoading && <Spinner />}
    </>
  );
}

export default Product;
