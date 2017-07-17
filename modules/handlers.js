"use strict";

let messenger = require('./messenger'),
    formatter = require('./formatter');

exports.thankYou = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `You're welcome, ${response.first_name}! I am happy to help. You could also provide feedback to my creator at http://bit.ly/2qOPctw`}, sender);
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




