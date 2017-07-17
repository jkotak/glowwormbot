"use strict";

let messenger = require('./messenger'),
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
        let text = 'Sure thing, '+response.first_name+'. I can help you search our rates in two ways: You can either search by category or by uploading a picture; pick an option below.'
        let postback = ['searchByCategory','searchByImage']
        let options = ['By Categories','By Image'];
        messenger.send(formatter.formatQuickReplies(text,postback,options), sender);
    });
};
exports.searchByImage = (sender) => {
    messenger.send({text: `OK, you can upload the image using messenger. Either take a picture of the product or just upload an image from your library. Go ahead and upload the picture.. I will wait`}, sender);
};





