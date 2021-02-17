const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const CartSchema = Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },

  products: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product"
    }
  ]
});

module.exports = model("Cart", CartSchema);
