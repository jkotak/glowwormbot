"use strict";

let messenger = require('./messenger'),
    formatter = require('./formatter'),
    userinfohandler = require('./userinfohandler'),
    casehandler = require('./casehandler');



exports.contact_me = (sender, values) => {
    messenger.send({text: "OK, I can ask Amisha to contact you. Go ahead and type your phone number."}, sender);
};

exports.confirm_visit = (sender, values) => {
    messenger.send({text: `Cool, I have asked Amisha to contact you at ${values[2]}. Thank you for contacting us!` + '\U+1F642'}, sender);
};

exports.incorrect_result = (sender, values) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `I am so sorry, ${response.first_name}! I have informed Amisha and provided all the information you have entered. She will contact you shorly.`}, sender);
    });
};

exports.view_options = (sender, values) => {
    messenger.send({text: `Absolutely! Searching for more options...` + '\U+1F642'}, sender);
};


exports.next_payment = (sender,values) =>{
    messenger.send(formatter.formatLoanAccountLinking(), sender);
};


exports.contact_support = (sender, values) => {
    messenger.getUserInfo(sender).then(response => {
        var current_stage = 0;
        var update = {
            "current_stage":0
        };
        casehandler.updateCase(sender,update).then(thiscase => { 
            userinfohandler.getSetUserHistory(sender,"startCase").then(() => {
               messenger.send(casehandler.createQuestion(sender,current_stage,values[0]), sender);
            });
        });
    });
};

exports.occupancy_type = (sender,values) => {
    messenger.send(loanapplicationhandler.createSecondQuestion(), sender);
}

exports.GET_STARTED_PAYLOAD = (sender, values) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `Hi, ${response.first_name}! Thanks for getting in touch with us! I can help you find rates for our product. Type help if you need my assistance.`}, sender);
    });
};


