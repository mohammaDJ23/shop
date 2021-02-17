import React, { memo } from "react";

import ProductItem from "./Product-Item/Product-Item";
import { lists } from "../../../shared/utils/create-list/create-list";

function ProductsList({
  products,
  addToCart,
  removeFromCart,
  itemPerRow,
  redirectHandler,
  dataChangeHandler
}) {
  return [...lists(products, itemPerRow)].map((products, index) => (
    <li key={Math.random()} className="row px-3 mb-1">
      <ProductItem
        itemPerRow={itemPerRow}
        row={index}
        products={products}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        redirectHandler={redirectHandler}
        dataChangeHandler={dataChangeHandler}
      />
    </li>
  ));
}

export default memo(ProductsList);
