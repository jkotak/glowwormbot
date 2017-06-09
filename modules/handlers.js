"use strict";

let salesforce = require('./salesforce'),
    messenger = require('./messenger'),
    formatter = require('./formatter'),
    loanapplicationhandler = require('./loanapplicationhandler');

let userid = null;

exports.searchHouse = (sender) => {
    messenger.send(formatter.requestLocation(), sender);
};

exports.searchProducts = (sender) => {
    messenger.send({text: `OK, looking for rates...`}, sender);
    salesforce.findAllRateTypes().then(rateTypes => {
        messenger.send(formatter.formatProductOptions (rateTypes), sender);
    });
};



exports.searchHouse_City = (sender, values) => {
    messenger.send({text: `OK, looking for houses in ${values[1]}`}, sender);
    salesforce.findProperties({city: values[1]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms_City_Range = (sender, values) => {
    messenger.send({text: `OK, looking for ${values[1]} bedrooms in ${values[2]} between ${values[3]} and ${values[4]}`}, sender);
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms_City = (sender, values) => {
    messenger.send({text: `OK, looking for ${values[1]} bedroom houses in ${values[2]}`}, sender);
    salesforce.findProperties({bedrooms: values[1], city: values[2]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Bedrooms = (sender, values) => {
    messenger.send({text: `OK, looking for ${values[1]} bedrooms`}, sender);
    salesforce.findProperties({bedrooms: values[1]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.searchHouse_Range = (sender, values) => {
    messenger.send({text: `OK, looking for houses between ${values[1]} and ${values[2]}`}, sender);
    salesforce.findProperties({priceMin: values[1], priceMax: values[2]}).then(properties => {
        messenger.send(formatter.formatProperties(properties), sender);
    });
};

exports.priceChanges = (sender, values) => {
    messenger.send({text: `OK, looking for recent price changes...`}, sender);
    salesforce.findPriceChanges().then(priceChanges => {
        messenger.send(formatter.formatPriceChanges(priceChanges), sender);
    });
};

exports.agent = (sender) => {
    messenger.send(formatter.formatTransferAgent(), sender);
};

exports.loanStatus = (sender) => {
    messenger.send(formatter.formatLoanAccountLinking(), sender);
};

exports.hi = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `Hello, ${response.first_name}! Welcome to Cumulus Mortgage Demo.`}, sender);
    });
};

exports.thankYou = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `You're welcome, ${response.first_name}! I am happy to help. You could also provide feedback to my creator at http://bit.ly/2qOPctw`}, sender);
    });
};

exports.wakeup = (sender) => {
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `Hello, ${response.first_name}! I am back. How can I help you?`}, sender);
    });
};
exports.authenticated =(sender,userid)=>{
    messenger.getUserInfo(sender).then(response => {
        messenger.send({text: `${response.first_name}, you are now authenticated. Let me check on that loan status for you...`}, sender).then(()=>{
            salesforce.getLoanStatus(userid).then(loans => {
                messenger.send(formatter.formatLoans(loans), sender);
            });
        });
    });
}

exports.startApplication = (sender,userinfo,params) =>{
    console.log(params)
    
    
    switch (params[1]) {
        case "askSecondQuestion":
            console.log('Params[3]:'+params[3]);
            var update = {
              'occupancy_type': params[3]
            }; 
            loanapplicationhandler.updateLoanApp(userinfo.user_id,update).then(application => {
                messenger.send(loanapplicationhandler.createSecondQuestion(), sender);
            });
            break;
        case "askThirdQuestion":
            console.log('Params[3]:'+params[3]);
            var update = {
              'property_type': params[3]
            }; 
            loanapplicationhandler.updateLoanApp(userinfo.user_id,update).then(application => {
                messenger.send(loanapplicationhandler.createThirdQuestion(), sender);
            });
            break;
        case "askFourthQuestion":
            console.log('Params[3]:'+params[3]);
            var update = {
              'email_address': params[3]
            }; 
            loanapplicationhandler.updateLoanApp(userinfo.user_id,update).then(application => {
                messenger.send(loanapplicationhandler.createFourthQuestion(), sender);
            });
            break;
         case "askFifthQuestion":
            var update = {
              'phone_number': params[3]
            }; 
            loanapplicationhandler.updateLoanApp(userinfo.user_id,update).then(application => {
                messenger.send(loanapplicationhandler.createFifthQuestion(application), sender);
            });
            break;   
        default:
          var update = {
              user_id: userinfo.user_id
          };
          loanapplicationhandler.createLoanApp(userinfo.user_id,update).then(application => {
            messenger.send(loanapplicationhandler.createFirstQuestion(), sender);
         });
      }

}

exports.ContinueWithAgent =(sender)=>{
    messenger.send({text: `Transfering now...please wait for an agent. If you need me just type "wakeup"`}, sender);
}
exports.ContinueWithoutAgent =(sender)=>{
    messenger.send({text: `Sorry, my bad. Type "Help" for a list of commands.`}, sender);
}

exports.help = (sender) => {
    messenger.send({text: `*This is for demonstration only*. You can ask me questions like "Loan Status", "Find houses in Boston", "3 bedrooms in Boston", "3 bedrooms in Boston between 500000 and 750000", "show me price changes","rates" or "Transfer to agent"`}, sender);
};

exports.catchall = (sender) => {
    messenger.send({text: `Sorry, I don't understand that command. For list of commands please type "help"`}, sender);
};

exports.creator = (sender)  =>{
    messenger.send({text: `Ah! You are referring to my creator; makes me very happy. I am his bot and for list of commands please type "help"`}, sender);
};

exports.mortgageApply = (sender)  =>{
    messenger.send(formatter.contactLoanOfficer(), sender);
};

