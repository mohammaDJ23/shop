const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const { Schema, model } = mongoose;

const rules = {
  type: String,
  required: true,
  unique: true,
  index: true
};

const UserSchema = new Schema(
  {
    name: rules,
    email: rules,
    password: rules
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator);
module.exports = model("User", UserSchema);
