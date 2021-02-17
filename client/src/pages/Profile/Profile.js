import React, { useContext, useEffect } from "react";

import ProfileList from "../../components/Profile-components/Profile-List/Profile-List";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import { routes } from "../../shared/utils/routes/routes";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";
import Error from "../../shared/ui/Error/Error";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";

function Profile() {
  const { sendRequest, data, dataChangeHandler, isLoading } = useHttp();
  const { redirectHandler } = useRedirect();
  const { errorText } = useContext(ErrorContext);
  const { createProduct } = routes();

  // send a request to the server

  useEffect(() => {
    (async () => {
      const { profile } = queries;
      const query = profile.bind(queries);

      try {
        await sendRequest({ body: query() });
      } catch (error) {}
    })();
  }, [sendRequest]);

  return (
    <>
      <Error />

      {Object.getOwnPropertyNames(data).length > 0 && !errorText && (
        <section className="w-max-1080 m-auto pt-2">
          <div className="container-fluid">
            <div className="row px-3 mb-4">
              <div>
                <h4>Name: {data.profile.name}</h4>
                <h6 className="my-3">
                  Total Products: {data.profile.totalProducts}
                </h6>

                <div>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={e => redirectHandler({ path: createProduct })}
                  >
                    Create new product
                  </button>
                </div>
              </div>
            </div>

            <hr />

            {data.profile.products.length > 0 ? (
              <ul>
                <ProfileList
                  products={data.profile.products}
                  redirectHandler={redirectHandler}
                  dataChangeHandler={dataChangeHandler}
                />
              </ul>
            ) : (
              <h4>There is no product in here</h4>
            )}
          </div>
        </section>
      )}

      {isLoading && <Spinner />}
    </>
  );
}

export default Profile;
