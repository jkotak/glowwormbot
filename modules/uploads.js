"use strict";

let messenger = require('./messenger'),
    producthandler = require('./producthandler'),
    formatter = require('./formatter');

const pvsUrl = process.env.EINSTEIN_VISION_URL;
const accountId  = process.env.EINSTEIN_VISION_ACCOUNT_ID;
const privateKey = process.env.EINSTEIN_VISION_PRIVATE_KEY;
const jwtToken = process.env.EINSTEIN_JWT_TOKEN;
const modelId = process.env.EINSTEIN_MODEL_ID;

const oAuthToken   = require('../lib/oauth-token'),
      updateToken  = require('../lib/update-token'),
      Episode7 = require('episode-7'),
      queryVisionApi = require("../lib/query-vision-api.js");


exports.processUpload = (sender, attachments,lastKeyword) => {
    
    if (attachments.length > 0) {
        let attachment = attachments[0];
        if (attachment.type === "image") {
            messenger.send({text: 'OK, let me look at that picture...'}, sender);
            let t = Episode7.run(
                queryVisionApi,
                pvsUrl,
                attachment.payload.url,
                modelId,
                accountId,
                privateKey,
                jwtToken
              ).then(predictions => {
                let predictionsJSON = JSON.parse(predictions);
                messenger.send({text: `Ah! You are looking for more information on ${predictionsJSON.probabilities[0].label}. Let me search and I will be right with you...`}, sender); 
                messenger.setTyping ('typing_on', sender);
                var array = [];
                for(var i = 0; i < predictionsJSON.probabilities.length; i++) {
                    var obj = predictionsJSON.probabilities[i];
                    console.log(obj.label);
                    array.push(obj.label);
                }
                producthandler.findProductByCategory(array).then(products =>{
                    messenger.send(formatter.formatProducts(products),sender);
                });
              });
            
        }else if (attachment.type === "location") {
            visionService.address( attachment.payload.coordinates.lat, attachment.payload.coordinates.long)
                .then(city => {
                    console.log(city);
                    messenger.send({text: `${city}, what a beautiful city! Looking for houses within 10 miles of your vicinity...`}, sender);
                });
        }else {
            messenger.send({text: 'This type of attachment is not supported'}, sender);
        }
    }
};
