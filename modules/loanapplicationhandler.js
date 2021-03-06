"use strict";

let mongoose = require("mongoose"),
        db = mongoose.connect(process.env.MONGODB_URI),
        formatter = require('./formatter'),
        LoanApplication = require("../models/loanapplication");
        
mongoose.Promise = global.Promise;
        

exports.createLoanApp = (userid,update) => {
    console.log(userid + ' ' + update);
    var query = {user_id: userid};
    var options = {upsert: true};
    return new Promise((resolve, reject) => {
        LoanApplication.updateOne(query, update, options,(err,loanApp)=> {
            if (err) {
                 reject("An error as occurred");
            } else {
                resolve(loanApp);
            }
        });
    });
};

exports.updateLoanApp = (userid,update) => {
    console.log(userid + ' ' + update);
    var filter = {user_id: userid};
    var options = {upsert: true, returnNewDocument : true};
    return new Promise((resolve, reject) => {
        LoanApplication.updateOne(filter, update,(err,loanApp) =>{
            if (err) {
                 reject("An error as occurred");
            } else {
                console.log(loanApp.user_id);
                resolve(loanApp);
            }
        });
    });
};

exports.findLoanApp = (userid) => {
    var filter = {user_id: userid};
    return new Promise((resolve, reject) => {
        LoanApplication.findOne(filter,(err,loanApp) =>{
            if (err) {
                 reject("An error as occurred");
            } else {
                console.log(loanApp.user_id);
                resolve(loanApp);
            }
        });
    });
};

exports.createFirstQuestion=()=>{
        var options = [
            'Primary Residence','Secondary Residence','Investment'
        ];
        var postbacks = 'startApplication,askSecondQuestion,occupancy_type';
        var question = 'I will walk you through a series of questions to gather some information. Once we complete these steps, I can send you a preapproval form. So let\'s get started, what is this property for?';
        return formatter.formatApplicationQuestions(question,postbacks,options);
};

exports.createSecondQuestion=()=>{
        var options = [
            'House','Condo','Town House','Multi-Family','Land','Other Type'    
        ];
        var postbacks = 'startApplication,askThirdQuestion,property_type';
        var question = 'Q 2/5:What is the type of asset?';
        return formatter.formatApplicationQuestions(question,postbacks,options);
};


exports.createThirdQuestion=()=>{
        return {text: `Q 3/5:What is the loan amount?`};
};

exports.createFourthQuestion=()=>{
        return {text: `Q 4/5:What is your email address?`};
};

exports.createFifthQuestion=()=>{
        return {text: `Q 5/5:What is your phone number?`};
};

exports.createSixthQuestion=(loanapp)=>{
        var options = [
            'Yes','No'    
        ];
        var postbacks = 'startApplication,processLoanApplication,information_confirmed';
        var question = 'You want a pre-approval in the amount of $' + loanapp.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +' to purchase '+ loanapp.property_type + ' that you will use as ' + loanapp.occupancy_type + ', correct?'  ;
        return formatter.formatApplicationQuestions(question,postbacks,options);
};


exports.createExceptionDocs=()=>{
        var options = [
            'Yes','No'    
        ];
        var postbacks = 'startApplication,process_docs,docs_uploaded';
        var question = 'Based on the information you provided, I need a copy of your driver\'s license. You can take a picture of it and upload here or email it to us later. Do you want to upload it now?'
        return formatter.formatApplicationQuestions(question,postbacks,options);
};

exports.process_docs=(loanapp)=>{
        
        return {text: `OK! Go ahead and upload it, I will wait.`}
};

exports.processLoanApplicationConfirmation=()=>{
        var options = [
            'Yes','No','Not Now'    
        ];
        var postbacks = 'startApplication,processLoanApplicationConfirmation,email_recieved';
        var question = 'I have emailed you a pre-approval email, could you check if you have recieved it?'  ;
        return formatter.formatApplicationQuestions(question,postbacks,options);
};

exports.createSixthQuestion=(loanapp)=>{
        var options = [
            'Yes','No'    
        ];
        var postbacks = 'startApplication,processLoanApplication,information_confirmed';
        var question = 'You want a pre-approval in the amount of $' + loanapp.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +' to purchase '+ loanapp.property_type + ' that you will use as ' + loanapp.occupancy_type + ', correct?'  ;
        return formatter.formatApplicationQuestions(question,postbacks,options);
};

exports.error=()=>{
        return {text: `I am sorry, but for some reason I am unable to process your request. You can try answering the previous question again, however, I have asked a loan office to contact you.`};
};
exports.approvalComplete=()=>{
        return {text: `Awesome! Good luck with your house hunting! How did I do? http://bit.ly/2qOPctw`};
};


