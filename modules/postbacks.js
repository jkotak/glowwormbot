"use strict";

let messenger = require('./messenger'),
    formatter = require('./formatter'),
    loanapplicationhandler = require('./loanapplicationhandler'),
    userinfohandler = require('./userinfohandler'),
    casehandler = require('./casehandler');



exports.contact_broker = (sender, values) => {
    messenger.send({text: "Here is the realtor information for this property"}, sender);
    messenger.send(formatter.formatBroker(), sender);
};

exports.confirm_visit = (sender, values) => {
    messenger.send({text: `OK, your appointment is confirmed for ${values[2]}. ${values[1]}.`}, sender);
};



exports.houses_near_me = (sender, values) => {
    messenger.send(formatter.requestLocation(), sender);
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
        messenger.send({text: `Hi, ${response.first_name}! Thanks for getting in touch with us! I am Glow Worm Creations' assistant. Type help if you need my assistance.`}, sender);
    });
};


