import { useLocation, useHistory } from "react-router-dom";

import { routes } from "../../utils/routes/routes";

export function useRedirect() {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { profile, product, cart, updateProduct } = routes();

  // replace handler.

  const replaceIdHanlder = ({ str, id }) => {
    return str.replace(":id", id);
  };

  // redirec handler.

  const redirectHandler = ({ path, id }) => {
    if (pathname === path) {
      return;
    }

    if ([product, profile, cart, updateProduct].includes(path)) {
      path = replaceIdHanlder({ str: path, id });
    }

    push(path);
  };

  return { redirectHandler };
}
