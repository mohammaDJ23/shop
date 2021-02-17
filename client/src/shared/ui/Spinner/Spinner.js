import React, { memo } from "react";

import "./Spinner.css";

function Spinner({ className = "position-fixed lt-50", small = false }) {
  return (
    <div className={className}>
      <div>
        <div className="lds-hourglass"></div>
      </div>
    </div>
  );
}

export default memo(Spinner);
