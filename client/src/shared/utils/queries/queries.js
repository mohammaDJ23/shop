export const queries = {
  // signup query

  signup: function ({ name, email, password }) {
    return {
      query: `
        mutation inputsType ( $name: String!, $email: String!, $password: String! ) {
          signup ( inputs: { name: $name, email: $email, password: $password } ) {
            _id
            name
          }
        }
      `,

      variables: {
        name,
        email,
        password
      }
    };
  },

  // login query

  login: function ({ email, password }) {
    return {
      query: `
        query inputsType ( $email: String!, $password: String! ) {
          login ( inputs: { email: $email, password: $password } ) {
            _id
            name
            token
          }
        }
      `,

      variables: {
        email,
        password
      }
    };
  },

  // home query

  home: function () {
    return {
      query: `
        query {
          home {
            _id
            productName
            price
            imageUrl
            userId
            addToCart
          }
        }
      `
    };
  },

  // profile query

  profile: function () {
    return {
      query: `
        query {
          profile {
            _id
            name

            products {
              _id
              productName
              description
              imageUrl
              price
            }

            totalProducts
          }
        }
      `
    };
  },

  // create or update a product query

  createOrUpdateProduct: function ({
    productName,
    description,
    imageUrl,
    price,
    id,
    pathname
  }) {
    return {
      query: `
        mutation inputsType ( $productName: String!, $description: String!, $imageUrl: String!, $price: Int!, $id: String!, $pathname: String! ) {
          createOrUpdateProduct ( inputs: { productName: $productName, description: $description, imageUrl: $imageUrl, price: $price, id: $id, pathname: $pathname } ) {
            message
          }
        }
      `,

      variables: {
        productName,
        description,
        imageUrl,
        price,
        id,
        pathname
      }
    };
  },

  // product query

  product: function ({ id }) {
    return {
      query: `
        query inputsType ( $id: String! ) {
          product ( inputs: { id: $id } ) {
            _id
            productName
            description
            imageUrl
            price
            userId
            addToCart
          }
        }
      `,

      variables: {
        id
      }
    };
  },

  // add or remove product from cart query

  addOrRemoveProductFromCart: function ({ id }) {
    return {
      query: `
        mutation inputsType ( $id: String! ) {
          addOrRemoveProductFromCart ( inputs: { id: $id } ) {
            message
          }
        }
      `,

      variables: {
        id
      }
    };
  },

  // cart query

  cart: function () {
    return {
      query: `
        query {
          cart {
            totalPrice
            totalProducts

            products {
              _id
              productName
              imageUrl
              price
            }
          }
        }
      `
    };
  },

  // delete cart query

  deleteCart: function () {
    return {
      query: `
        mutation {
          deleteCart {
            message
          }
        }
      `
    };
  },

  // delete product query

  deleteProduct: function ({ id }) {
    return {
      query: `
        mutation inputsType ( $id: String! ) {
          deleteProduct ( inputs: { id: $id } ) {
            message
          }
        }
      `,

      variables: {
        id
      }
    };
  }
};
