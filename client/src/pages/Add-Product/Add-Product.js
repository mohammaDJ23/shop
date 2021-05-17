import React, { useContext } from "react";
import { useLocation, useParams } from "react-router-dom";

import ProductInputs from "../../components/Add-Product-components/Product-Inputs/Product-Inputs";
import { useFormValidation } from "../../shared/hooks/form-validation/form-validation";
import Error from "../../shared/ui/Error/Error";
import { routes } from "../../shared/utils/routes/routes";
import { useHttp } from "../../shared/hooks/http/useHttp";
import { queries } from "../../shared/utils/queries/queries";
import { LoginContext } from "../../shared/context/login/login";
import { useRedirect } from "../../shared/hooks/redirect/redirect";
import Spinner from "../../shared/ui/Spinner/Spinner";
import { ErrorContext } from "../../shared/context/error/error";

function AddProduct() {
  const { pathname } = useLocation();
  const { id = "" } = useParams();
  const { formValidation, inputs, formValidationHandler } = useFormValidation();
  const { sendRequest, isLoading } = useHttp();
  const { redirectHandler } = useRedirect();
  const { _id } = useContext(LoginContext);
  const { errorText } = useContext(ErrorContext);
  const { profile } = routes();
  const { createOrUpdateProduct } = queries;

  // send data to the server

  const onSubmitHandler = async e => {
    e.preventDefault();
    const { productName, description, price, file } = inputs;

    // first we should send image with rest api

    const formData = new FormData();
    formData.append("image", file.value);

    try {
      const imagePath = await sendRequest({
        url: `${process.env.REACT_APP_IMAGE_URL}image`,
        body: formData
      });

      // then send other data with graphql plus image path

      const values = {
        productName: productName.value,
        description: description.value,
        price: +price.value,
        imageUrl: imagePath,
        id,
        pathname: pathname
      };

      const query = createOrUpdateProduct.bind(queries, values);
      await sendRequest({ body: query() });
      redirectHandler({ path: profile, id: _id });
    } catch (error) {}
  };

  return (
    <>
      <Error />

      {!errorText && (
        <section className="w-max-600 m-auto pt-2">
          <div className="container-fluid">
            <div className="row px-3">
              <div className="col px-0 align-self-center">
                <div className="border p-3">
                  <form onSubmit={onSubmitHandler}>
                    <ProductInputs formValidationHandler={formValidationHandler} />

                    <div className="d-flex">
                      <button type="submit" className="btn btn-primary" disabled={!formValidation}>
                        {pathname.indexOf("/create-product") > -1
                          ? "Create product"
                          : pathname.indexOf("/update-product") > -1 && "Update product"}
                      </button>

                      {isLoading && <Spinner className="ml-2" />}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default AddProduct;
