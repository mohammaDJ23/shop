import { useEffect, useState } from "react";

export function useItemsPerPage() {
  const [itemsPerRow, setItemsPerRow] = useState(3);

  useEffect(() => {
    const resizeHandler = e => {
      if (window.visualViewport.width <= 1080) {
        setItemsPerRow(2);
      } else if (window.visualViewport.width >= 1080) {
        setItemsPerRow(3);
      }
    };

    const resize = () => {
      resizeHandler();
    };

    resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return { itemsPerRow };
}
