import React, { memo, useContext } from "react";

import { LoginContext } from "../../../shared/context/login/login";
import { cases } from "../../../shared/utils/cases/cases";

import "./Single-Product.css";

function SingleProduct({
  _id,
  productName,
  description,
  price,
  imageUrl,
  addToCart,
  userId,
  dataChangeHandler
}) {
  const { _id: uId } = useContext(LoginContext);
  const { ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT } = cases;

  return (
    <>
      <div className="row px-3 mb-3">
        <div className="col px-0 h-500 w-100">
          <img
            src={`${process.env.REACT_APP_IMAGE_URL}${imageUrl}`}
            alt={productName}
            className="w-100 h-100 image-cover"
          />
        </div>
      </div>

      <div className="row px-3">
        <div className="col px-0">
          <div>
            <h2 className="mb-4">
              <b>{productName}</b>
            </h2>

            <hr />
            <h5 className="mb-2 mt-4">{description}</h5>
            <p>Price: ${price}</p>

            {userId !== uId && (
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={e =>
                    dataChangeHandler({
                      action: ADD_PRODUCT_TO_CART_BUTTON_SINGLE_PRODUCT,
                      id: _id
                    })
                  }
                >
                  {!addToCart ? "Add to cart" : "Remove from cart"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(SingleProduct);
