import React, { memo } from "react";

import Input from "../../../shared/ui/Input/Input";
import { rules } from "../../../shared/utils/validations/validations";

function ProductInputs({ formValidationHandler }) {
  const {
    minLength,
    maxLength,
    minPrice,
    isFile,
    require,
    isAlphanumeric
  } = rules();

  return (
    <>
      <Input
        formValidationHandler={formValidationHandler}
        name="productName"
        label="Product name"
        type="text"
        id="productName"
        placeholder="Enter product name"
        className="form-control"
        errorText="Please enter a valid name for prodcut"
        rules={{
          rules: [maxLength, minLength, isAlphanumeric],
          minNum: 3,
          maxNum: 30
        }}
        isFile={false}
      />

      <Input
        formValidationHandler={formValidationHandler}
        name="description"
        label="Description"
        type="text"
        id="description"
        placeholder="Enter description"
        className="form-control"
        errorText="Please enter a valid description"
        rules={{ rules: [maxLength, minLength], minNum: 10, maxNum: 100 }}
        isFile={false}
      />

      <Input
        formValidationHandler={formValidationHandler}
        name="price"
        label="Price"
        type="text"
        id="price"
        placeholder="Enter price"
        className="form-control"
        errorText="Please enter a valid price"
        rules={{ rules: [require, minPrice] }}
        isFile={false}
      />

      <Input
        formValidationHandler={formValidationHandler}
        type="file"
        id="file"
        label="Select an image"
        className="form-control-file"
        isFile={true}
        errorText="Please pick an image"
        rules={{ rules: [isFile] }}
      />
    </>
  );
}

export default memo(ProductInputs);
