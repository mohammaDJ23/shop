const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProductSchema = Schema({
  productName: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },

  addToCart: {
    type: Boolean,
    required: true
  },

  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

module.exports = model("Product", ProductSchema);
