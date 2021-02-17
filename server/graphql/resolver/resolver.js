const fs = require("fs");
const path = require("path");

// packages

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// files

const User = require("../../models/user/user");
const Product = require("../../models/product/product");
const jwtKey = require("../../utils/jwt-key/jwt-key");
const validation = require("../../utils/validation/validation");
const token = require("../../middleware/token/token");
const toObjectId = require("../../utils/convert-to-object-id/convert-to-object-id");
const Cart = require("../../models/cart/cart");
const fileCleaner = require("../../utils/file-cleaner/file-cleaner");

const dbOptions = {
  returnOriginal: false,
  runValidators: true,
  context: "query",
  useFindAndModify: false
};

module.exports = {
  // signup function handler.

  signup: async function ({ inputs }, req) {
    try {
      // check if the user already has a token

      const userHasToken = token({ req });

      if (userHasToken) {
        throw {
          message: "You have a token already, first logout and then login."
        };
      }

      const { name, email, password } = inputs;

      // check inputs validaitons

      const isEmptyError = validation({ inputs });

      if (isEmptyError.length > 0) {
        const { message, code } = isEmptyError[0];
        throw { message, code };
      }

      // check if a user finded in the database by the email

      const findedUser = await User.findOne({ email });

      if (findedUser) {
        throw {
          message: "The email exist in the database, please pick another email",
          code: 409
        };
      }

      // if there is not the same email the save the informaiton in the database,
      // first we should encode the user password

      const encodedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        name,
        email,
        password: encodedPassword
      });

      // save new data in the database

      await user.save();

      // send a port of data to the client

      return { _id: user._id.toString(), name: user.name };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // login function handler

  login: async function ({ inputs }, req) {
    try {
      // check if the user already has a token

      const userHasToken = token({ req });

      if (userHasToken) {
        throw {
          message: "You have a token already, first logout and then login."
        };
      }

      const { email, password } = inputs;

      // check inputs validaitons

      const isEmptyError = validation({ inputs });

      if (isEmptyError.length > 0) {
        const { message, code } = isEmptyError[0];
        throw { message, code };
      }

      // check the user with the email

      const findedUser = await User.findOne({ email });

      if (!findedUser) {
        throw {
          message: "Your email is wrong, please enter your own email.",
          code: 403
        };
      }

      const {
        _id,
        password: originalPassword,
        email: originalEmail,
        name
      } = findedUser;

      // then ckeck the new password with original password

      const decodedPassword = await bcrypt.compare(password, originalPassword);

      if (!decodedPassword) {
        throw {
          message: "Your password is wrong, please enter your own password.",
          code: 403
        };
      }

      // then generate a token

      const jwtToken = await jwt.sign(
        { _id: _id.toString(), email: originalEmail },
        jwtKey(),
        { expiresIn: "1h" }
      );

      // send a port of data to the client

      return { name, token: jwtToken, _id };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // home function handler

  home: async function ({}, req) {
    try {
      // find all products except the user's products

      const products = await Product.aggregate([
        {
          $project: {
            _id: { $toString: "$_id" },
            price: 1,
            productName: 1,
            imageUrl: 1,
            addToCart: 1,
            userId: { $toString: "$userId" }
          }
        },
        { $sort: { _id: -1 } }
      ]);

      // send data to the client

      return products;
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // profile function handler

  profile: async function ({}, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      const { _id } = isTokenValid;

      // find the user by _id from decoded token

      const user = await User.aggregate([
        { $match: { _id: toObjectId({ id: _id }) } },
        { $project: { _id: { $toString: "$_id" }, name: 1 } }
      ]);

      // find all products that is belongs to the user

      const products = await Product.aggregate([
        { $match: { userId: toObjectId({ id: _id }) } },
        {
          $project: {
            _id: { $toString: "$_id" },
            productName: 1,
            description: 1,
            imageUrl: 1,
            price: 1
          }
        },
        { $sort: { _id: -1 } }
      ]);

      // send data to the client

      return { ...user[0], products, totalProducts: products.length };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // create or update a product function handler

  createOrUpdateProduct: async function ({ inputs }, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        const { imageUrl } = inputs;
        fileCleaner({ imageUrl });

        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      // check inputs validaitons

      const isEmptyError = validation({ inputs });

      if (isEmptyError.length > 0) {
        const { message, code } = isEmptyError[0];
        throw { message, code };
      }

      const { _id } = isTokenValid;
      const { id, productName, description, price, imageUrl, pathname } = inputs;

      // check for create or update a product

      switch (true) {
        // create new product

        case pathname.indexOf("/create-product") > -1:
          const product = new Product({
            productName,
            description,
            price,
            imageUrl,
            addToCart: false,
            userId: toObjectId({ id: _id })
          });

          await product.save();
          break;

        // update product

        case pathname.indexOf("/update-product") > -1:
          const priorProduct = await Product.findOneAndUpdate(
            { _id: toObjectId({ id }), userId: toObjectId({ id: _id }) },
            { productName, description, imageUrl, price },
            { ...dbOptions, returnOriginal: true }
          );

          // delete prior image of the product

          const { imageUrl: image } = priorProduct;

          if (image) {
            fileCleaner({ imageUrl: image });
          }

          break;

        default:
          throw { message: "Invalid ulr." };
      }

      // send data to the client

      return { message: true };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // product function handler

  product: async function ({ inputs }, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      const { id: productId } = inputs;

      // find the product by productId

      const product = await Product.aggregate([
        {
          $match: {
            _id: toObjectId({ id: productId })
          }
        },

        {
          $project: {
            _id: { $toString: "$_id" },
            productName: 1,
            description: 1,
            imageUrl: 1,
            price: 1,
            addToCart: 1,
            userId: { $toString: "$userId" }
          }
        }
      ]);

      // send data to the client

      return { ...product[0] };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // add or remove from the cart function handler

  addOrRemoveProductFromCart: async function ({ inputs }, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      const { _id } = isTokenValid;
      const { id: productId } = inputs;

      // check if the user wants to save his product to cart, then should return response from here

      const theUserProduct = await Product.findOne({
        _id: toObjectId({ id: productId }),
        userId: toObjectId({ id: _id })
      });

      if (theUserProduct) {
        return { message: true };
      }

      // ckeck if the user has a cart document

      const userHasCart = await Cart.findOne({ userId: toObjectId({ id: _id }) });

      if (!userHasCart) {
        const cart = new Cart({
          userId: toObjectId({ id: _id }),
          products: []
        });

        await cart.save();
      }

      // check if the product is in the cart document
      // if there was so remove it
      // if there was't then add it

      const isProductInCart = await Cart.findOne({
        products: toObjectId({ id: productId })
      });

      const session = await mongoose.startSession();
      session.startTransaction();

      if (!isProductInCart) {
        const addProductFromCart = await Cart.findOneAndUpdate(
          { userId: toObjectId({ id: _id }) },
          { $addToSet: { products: toObjectId({ id: productId }) } },
          dbOptions
        );

        const product = await Product.findOneAndUpdate(
          { _id: toObjectId({ id: productId }) },
          { addToCart: true },
          dbOptions
        );

        await addProductFromCart.save({ session });
        await product.save({ session });
      } else if (isProductInCart) {
        const removeProductFromCart = await Cart.findOneAndUpdate(
          { userId: toObjectId({ id: _id }) },
          { $pull: { products: toObjectId({ id: productId }) } },
          dbOptions
        );

        const product = await Product.findOneAndUpdate(
          { _id: toObjectId({ id: productId }) },
          { addToCart: false },
          dbOptions
        );

        await removeProductFromCart.save({ session });
        await product.save({ session });
      }

      await session.commitTransaction();
      session.endSession();
      return { message: true };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // all products in the cart function handler

  cart: async function ({}, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      // get all products in the user cart

      const { _id } = isTokenValid;

      const cart = await Cart.aggregate([
        { $match: { userId: toObjectId({ id: _id }) } },
        { $project: { _id: 0, products: 1 } },
        { $unwind: "$products" },

        {
          $lookup: {
            from: "products",
            localField: "products",
            foreignField: "_id",
            as: "products"
          }
        },

        { $unwind: "$products" },

        {
          $project: {
            _id: { $toString: "$products._id" },
            productName: "$products.productName",
            price: "$products.price",
            imageUrl: "$products.imageUrl"
          }
        },

        {
          $group: {
            _id: null,
            totalPrice: { $sum: "$price" },
            totalProducts: { $sum: 1 },

            products: {
              $push: {
                _id: "$_id",
                productName: "$productName",
                price: "$price",
                imageUrl: "$imageUrl"
              }
            }
          }
        }
      ]);

      // send data to the client

      return cart[0] || { products: [], totalPrice: 0, totalProducts: 0 };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // delete cart function handler

  deleteCart: async function ({}, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      const { _id } = isTokenValid;

      // delete operation with transaction

      const session = await mongoose.startSession();
      session.startTransaction();

      // delete cart document by the user id

      await Cart.deleteOne({ userId: toObjectId({ id: _id }) }, { session });

      // if add to cart field is true then convert it to the false

      await Product.updateMany(
        { addToCart: true },
        { addToCart: false },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      // send data to the client

      return { message: true };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  },

  // delete product function handler

  deleteProduct: async function ({ inputs }, req) {
    try {
      // check if the user token is valid

      const isTokenValid = token({ req });

      if (!isTokenValid) {
        throw {
          message: "Authentication failed.",
          code: 403
        };
      }

      const { _id: userId } = isTokenValid;
      const { id: productId } = inputs;

      // delete product by the product id and the user id

      const product = await Product.findOneAndDelete(
        {
          _id: toObjectId({ id: productId }),
          userId: toObjectId({ id: userId })
        },

        dbOptions
      );

      // delete image of the product

      const { imageUrl } = product;

      if (imageUrl) {
        fileCleaner({ imageUrl });
      }

      return { message: true };
    } catch (error) {
      const err = new Error(error.message);
      err.code = error.code;
      throw err;
    }
  }
};
