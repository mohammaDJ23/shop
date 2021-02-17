import React, { memo, useContext } from "react";

import { ErrorContext } from "../../context/error/error";

import "./Error.css";

function Error() {
  const { errorText, errorHandler } = useContext(ErrorContext);

  return (
    errorText &&
    errorText.length > 0 && (
      <section className="m-auto wh-100-v bg-secondary">
        <div className="container-fluid">
          <div className="row p-3">
            <div className="col px-0">
              <div className="position-fixed p-4 bg-light lt-50 z-4">
                <div className="word-wrap position-relative">
                  <p>Error: {errorText}</p>
                </div>

                <div
                  className="hover position-absolute rt-6-0"
                  onClick={() => errorHandler("")}
                >
                  &#10005;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  );
}

export default memo(Error);
