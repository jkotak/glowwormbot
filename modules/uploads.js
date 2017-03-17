"use strict";

let messenger = require('./messenger'),
    formatter = require('./formatter'),
    salesforce = require('./salesforce'),
    visionService = require('./vision-service-mock');

exports.processUpload = (sender, attachments) => {
    if (attachments.length > 0) {
        let attachment = attachments[0];
        if (attachment.type === "image") {
            messenger.send({text: 'OK, let me look at that picture...'}, sender);
            visionService.classify(attachment.url)
                .then(houseType => {
                    messenger.send({text: `Looking for houses matching "${houseType}"`}, sender);
                    return salesforce.findPropertiesByCategory(houseType)
                })
                .then(properties => messenger.send(formatter.formatProperties(properties), sender))
        }else if (attachment.type === "location") {
            visionService.address( attachment.payload.coordinates.lat, attachment.payload.coordinates.long)
                .then(city => {
                    console.log(city);
                    messenger.send({text: `${city}, what a beautiful city! Looking for houses within 10 miles of your vicinity...`}, sender);
                    return true;     
                })
        }
        else {
            messenger.send({text: 'This type of attachment is not supported'}, sender);
        }
    }
};
