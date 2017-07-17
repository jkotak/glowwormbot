"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  product_name: {type: String},
  description: {type: String},
  product_category: {type: String},
  top_range: {type: Number},
  bottom_range: {type: Number},
  photo_url: {type: String}
});

module.exports = mongoose.model("Product", ProductSchema);
