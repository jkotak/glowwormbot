"use strict";

let messenger = require('./messenger'),
    producthandler = require('./producthandler'),
    formatter = require('./formatter');

exports.thankYou = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `You're welcome, ${response.first_name}! I am happy to help.`}, sender);
    });
};


exports.help = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        let text = 'Sure thing, '+response.first_name+'. I can help you search our rates in two ways: You can either search by category or by uploading a picture; pick an option below.'
        let postback = ['searchByCategory','searchByImage']
        let options = ['By Categories','By Image'];
        messenger.send(formatter.formatQuickReplies(text,postback,options), sender);
    });
};

exports.searchByCategory = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        let text = 'Absolutely, '+response.first_name+'. Which category would you like to know more about?'
        let projections = {"product_category":1};
        producthandler.findProducts(projections).then(products => {
            console.log(products);
            var postbacks = [];
            var options = [];
            for(var i = 0; i < products.length; i++) {
                postbacks.push('displayCategory');
                options.push(products.product_category);
            }
            console.log(postbacks);
            console.log(options);
            messenger.send(formatter.formatQuickReplies(text,postbacks,options), sender);
        });
    });
};
exports.searchByImage = (sender) => {
    messenger.send({text: `OK, you can upload the image using messenger. Either take a picture of the product or just upload an image from your library. Go ahead and upload the picture.. I will wait`}, sender);
};





