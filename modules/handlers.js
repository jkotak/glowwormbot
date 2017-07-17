"use strict";

let messenger = require('./messenger'),
    formatter = require('./formatter'),

exports.thankYou = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `You're welcome, ${response.first_name}! I am happy to help. You could also provide feedback to my creator at http://bit.ly/2qOPctw`}, sender);
    });
};


exports.help = (sender) => {
    messenger.send({text: `*This is for demonstration only*. You can ask me "I want a pre-approval","Open a ticket", "What is my loan status", "Find houses near me", "Find houses in Boston", "3 bedrooms in Boston", "3 bedrooms in Boston between 500000 and 750000" or "what are the rates"`}, sender);
};




