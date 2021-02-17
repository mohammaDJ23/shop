import React, { useContext } from "react";

import { LoginContext } from "../../../context/login/login";
import { routes } from "../../../utils/routes/routes";
import { cases } from "../../../utils/cases/cases";

import "./Product-Item.css";

function ProductItme({
  itemPerRow,
  row,
  products,
  addToCart,
  removeFromCart,
  redirectHandler,
  dataChangeHandler
}) {
  const { isLogin, _id } = useContext(LoginContext);
  const { product } = routes();

  const {
    ADD_PRODUCT_TO_CART_BUTTON_HOME,
    REMOVE_PRODUCT_FROM_CART_BUTTON_CART
  } = cases;

  return products.map(
    (
      {
        _id: productId,
        productName,
        price,
        imageUrl,
        userId,
        addToCart: addToCartButton
      },
      index
    ) => {
      const clickOnProductHandler = ({ productId }) => {
        if (!isLogin) {
          return;
        }

        redirectHandler({ path: product, id: productId });
      };

      return (
        <div
          key={productId}
          className="col px-0 mr-1 hover position-relative product bg-light"
        >
          <div className="h-300 overflow-hidden">
            <img
              className="w-100 h-100 image-cover product-image t-02"
              src={`${process.env.REACT_APP_IMAGE_URL}${imageUrl}`}
              alt={productName}
            />
          </div>

          <div
            className="position-absolute lt-0 b-black t-02 w-100 h-100 product-info opacity-0"
            onClick={e => clickOnProductHandler({ productId })}
          >
            <div className="position-absolute lt-50 text-center fs-24">
              <p className="c-white mb-2">{productName}</p>
              <p className="c-white">${price}</p>
            </div>
          </div>

          {isLogin && _id !== userId && (
            <div className="position-absolute lb-50-20 opacity-0 product-button">
              <button
                onClick={e =>
                  dataChangeHandler({
                    id: productId,
                    index: row >= 1 ? index + itemPerRow * row : index,

                    action: addToCart
                      ? ADD_PRODUCT_TO_CART_BUTTON_HOME
                      : REMOVE_PRODUCT_FROM_CART_BUTTON_CART
                  })
                }
                type="button"
                className={`${addToCart && "btn btn-outline-primary"} ${
                  removeFromCart && "btn btn-outline-danger"
                }`}
              >
                {addToCart
                  ? !addToCartButton
                    ? "Add To Cart"
                    : "Remove from cart"
                  : removeFromCart && "Remove"}
              </button>
            </div>
          )}
        </div>
      );
    }
  );
}

export default ProductItme;
