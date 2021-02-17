import React from "react";

import { routes } from "../../../../shared/utils/routes/routes";
import { cases } from "../../../../shared/utils/cases/cases";

import "./Profile-Item.css";

function ProfileItem({
  index,
  _id,
  description,
  productName,
  price,
  imageUrl,
  redirectHandler,
  dataChangeHandler
}) {
  const { DELETE_PRODUCT } = cases;
  const { updateProduct } = routes();

  return (
    <div className="border">
      <div className="bg-light">
        <img
          src={`${process.env.REACT_APP_IMAGE_URL}${imageUrl}`}
          alt={productName}
          className="w-100 h-200 image-cover"
        />
      </div>

      <div>
        <div>
          <h3>
            <b>{productName}</b>
          </h3>

          <p className="my-3">{description}</p>
          <p>price: ${price}</p>
        </div>
      </div>

      <div>
        <div className="d-flex flex-column justify-content-center">
          <button
            type="button"
            className="btn btn-outline-primary mb-2"
            onClick={e =>
              redirectHandler({
                path: updateProduct,
                id: _id
              })
            }
          >
            Update
          </button>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={e =>
              dataChangeHandler({ index, action: DELETE_PRODUCT, id: _id })
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileItem;
