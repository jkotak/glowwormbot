"use strict";

let mongoose = require("mongoose"),
        db = mongoose.connect(process.env.MONGODB_URI),
        formatter = require('./formatter'),
        Service = require("../models/product");
        
mongoose.Promise = global.Promise;

exports.findProductByCategory = (categories) => {	
    console.log(categories);
    var filter = {
	    "product_category": {
		"$in": categories
	    }
	}
    return new Promise((resolve, reject) => {
        Service.find(filter,(err,products) =>{
            if (err) {
                 reject("An error as occurred");
            } else {
		console.log(products);
                resolve(products);
            }
        }).limit(2);
    });
};

exports.findProducts = (projections) => {	
    return new Promise((resolve, reject) => {
        Service.find({},projections,(err,products) =>{
            if (err) {
                 reject("An error as occurred");
            } else {
		console.log(products);
                resolve(products);
            }
        });
    });
};

exports.findOneProduct = (query) => {
    return new Promise((resolve, reject) => {
        Service.findOne(query).then(function(product) {
	    console.log(product.user_id);
            resolve(product);
        });
    });
};
