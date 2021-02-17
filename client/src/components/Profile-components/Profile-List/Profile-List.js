import React, { memo } from "react";

import ProfileItem from "./Profile-Item/Profile-Item";

function ProfileList({ products, redirectHandler, dataChangeHandler }) {
  return products.map((product, index) => (
    <li key={index} className="row px-3 mb-3 h-200 row-item">
      <ProfileItem
        index={index}
        {...product}
        redirectHandler={redirectHandler}
        dataChangeHandler={dataChangeHandler}
      />
    </li>
  ));
}

export default memo(ProfileList);
