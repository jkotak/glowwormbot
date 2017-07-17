"use strict";

var express = require('express'),
    bodyParser = require('body-parser'),
    processor = require('./modules/processor'),
    postbacks = require('./modules/postbacks'),
    userinfohandler = require('./modules/userinfohandler'),
    uploads = require('./modules/uploads'),
    FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN,
    Episode7 = require('episode-7'),
    app = express();

const pvsUrl = process.env.EINSTEIN_VISION_URL;
const accountId  = process.env.EINSTEIN_VISION_ACCOUNT_ID;
const privateKey = process.env.EINSTEIN_VISION_PRIVATE_KEY;

let jwtToken;

const oAuthToken   = require('./lib/oauth-token'),
      updateToken  = require('./lib/update-token')


app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());

app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Error, wrong validation token');
    }
});


app.get('/authorize', (req, res) => {
    var requestURI = req.param('redirect_uri');
    var token = req.param('authorization_code');
    res.redirect(requestURI+'&authorization_code='+token);
});

app.get('/setup',function(req,res){
    console.log('I am being called');
    setMenu();
});

app.post('/webhook', (req, res) => {
    if (req.body.object == "page") {
        let events = req.body.entry[0].messaging;
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let sender = event.sender.id;
            console.log('Checking event'+ event.message.text);
            userinfohandler.findOneAndUpdateUserInfo(sender,{}).then(user => {
                if (process.env.MAINTENANCE_MODE && ((event.message && event.message.text) || event.postback)) {
                    sendMessage({text: `Sorry I'm taking a break right now.`}, sender);
                } else if (event.message && event.message.text) {
                    let result = processor.match(event.message.text);
                }else if (event.postback) {
                    let payload = event.postback.payload.split(",");
                    let postback = postbacks[payload[0]];
                    if (postback && typeof postback === "function") {
                        postback(sender, payload);
                    } else {
                        console.log("Postback " + postback + " is not defined");
                    }
                } else if (event.message && event.message.attachments) {
                    uploads.processUpload(sender, event.message.attachments,user.last_keyword);
                } 
            });//end find user
        }//end loop
    
        res.sendStatus(200);
    }
});


Episode7.run(updateToken, pvsUrl, accountId, privateKey)
.then((token) => {
    jwtToken = token;
    app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
})
.catch(error => {
  console.log(`Failed to start server: ${error.stack}`);
  process.exit(1);
});
