export function routes() {
  return {
    home: "/home",
    auth: "/auth",
    createProduct: "/create-product",
    updateProduct: "/update-product/:id",
    cart: "/cart/:id",
    product: "/product/:id",
    profile: "/profile/:id"
  };
}
