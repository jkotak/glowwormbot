"use strict";

let mongoose = require("mongoose"),
        db = mongoose.connect(process.env.MONGODB_URI),
        formatter = require('./formatter'),
        Service = require("../models/product");
        
mongoose.Promise = global.Promise;

find({
    '_id': { $in: teamIds }
}

exports.findProductByCategory = (category) => {
    var filter = {
    'product_category': { $in: category }
    };
    return new Promise((resolve, reject) => {
        Service.find(filter,(err,product) =>{
            if (err) {
                 reject("An error as occurred");
            } else {
                resolve(newcase);
            }
        });
    });
};

exports.findOneProduct = (userid,update) => {
    var query = {user_id: userid};
    var options = {upsert: true,returnNewDocument:true};
    return new Promise((resolve, reject) => {
        Service.findOneAndUpdate(query, update, options).then(function(newcase) {
	    console.log(newcase.user_id);
            resolve(newcase);
        });
    });
};


