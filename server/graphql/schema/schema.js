const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  input Id {
    id: String!
  }

  type RequestedMessage {
    message: Boolean!
  }

  type Product {
    _id: String!
    productName: String!
    description: String
    imageUrl: String!
    addToCart: Boolean
    price: Int!
    userId: String
  }




  type RequestedSignupData {
    _id: String!
    name: String!
  }

  input SignupData {
    name: String!
    email: String!
    password: String!
  }

  input createOrUpdateProductData {
    productName: String!
    description: String!
    imageUrl: String!
    price: Int!
    id: String!
    pathname: String!
  }

  type RootMutation {
    signup (inputs: SignupData!): RequestedSignupData!
    createOrUpdateProduct (inputs: createOrUpdateProductData!): RequestedMessage!
    addOrRemoveProductFromCart (inputs: Id!): RequestedMessage!
    deleteCart: RequestedMessage!
    deleteProduct (inputs: Id!): RequestedMessage!
  }
  
  
  
  
  type RequestedLoginData {
    _id: String!
    name: String!
    token: String!
  }
  
  input LoginData {
    email: String!
    password: String!
  }
  
  type RequestedProfileData {
    _id: String!
    name: String!
    products: [Product!]!
    totalProducts: Int!
  }

  type RequestedCartData {
    _id: String
    totalProducts: Int!
    totalPrice: Int!
    products: [Product!]!
  }
  
  type RootQuery {
    login (inputs: LoginData!): RequestedLoginData!
    home: [Product!]!
    profile: RequestedProfileData!
    product (inputs: Id!): Product!
    cart: RequestedCartData!
  }
  
  
  
  
  schema {
    query: RootQuery
    mutation: RootMutation
  }
  `);
