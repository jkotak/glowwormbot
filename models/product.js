"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  product_name: {type: String},
  product_description: {type: String},
  product_category: {type: String},
  price_top_range: {type: Number},
  price_bottom_range: {type: Number},
  product_photo_url: {type: String}
});

module.exports = mongoose.model("Product", ProductSchema);
