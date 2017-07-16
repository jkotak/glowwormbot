"use strict";

const pvsUrl = process.env.EINSTEIN_VISION_URL;
const accountId  = process.env.EINSTEIN_VISION_ACCOUNT_ID;
const privateKey = process.env.EINSTEIN_VISION_PRIVATE_KEY;
const jwtToken = process.env.EINSTEIN_JWT_TOKEN;
const modelId = process.env.EINSTEIN_MODEL_ID;

const oAuthToken   = require('./lib/oauth-token'),
      updateToken  = require('./lib/update-token'),
      Episode7 = require('episode-7'),
      queryVisionApi = require("./lib/query-vision-api.js");

exports.classify = imageURL => new Promise((resolve, reject) => {
    let t = Episode7.run(
            queryVisionApi,
            pvsUrl,
            imageURL,
            modelId,
            accountId,
            privateKey,
            jwtToken
          ).then(predictions => {
            let predictionsJSON = JSON.parse(predictions);
            return predictionsJSON.probabilities[0].label;
          });
});



exports.address = (latitude, longitude) => {
    return new Promise(function (resolve, reject) {
        var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
        console.log('URL: '+url);
        var request = https.get(url, function(response){
            var body = "";
            //read the data
            response.on('data', function(chunk) {
              body += chunk;
            });
            console.log('Body: '+body);
            response.on('end', function(){
                console.log('Response: '+response.statusCode);
                //console.log(body);
                if(response.statusCode ===200){
                    try {
                        //parse the data (read the data from a string in a program friendly way
                        console.log('Response: '+response);
                        var profile = JSON.parse(body);
                        //print out the data
                        console.log(profile.results[0].address_components[3].long_name);
                       
                        resolve(profile.results[0].address_components[3].long_name);
                    } catch(error) {
                        //handling a parse error
                        reject(response);
                    }
                } else {
                    //handling status code error
                   reject(response);
                }
            });
          });
    });
};
