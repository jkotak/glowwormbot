const rp = require('request-promise');
var Episode7 = require('episode-7');
const updateToken = require('./update-token');
const oAuthToken = require('./oauth-token');

let loopPreventor = false;

function* queryVisionApi(
                       pvsUrl,
                       resizedImgUrl,
                       modelId,
                       accountId,
                       privateKey,
                       jwtToken){
  var token = jwtToken || oAuthToken.get();
  console.log('Token is '+ token);
  console.log('Model Id is '+ modelId);
  console.log('URL is '+ resizedImgUrl);
  var formData = {
    modelId: modelId,
    sampleLocation : resizedImgUrl
  }
  
  console.log('Check point 1');
  var options = {
      url: `${pvsUrl}v1/vision/predict`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'

      },
      formData:formData
  }
  
  console.log('Check point 2');
  let { body, isUnauthorized } = yield Episode7.call((options) => {
    console.log('option ' + options);
    return rp(options)
      .then( body => ({ body }) )
      .catch( error => {
        if(error.statusCode === 401) {
          return { isUnauthorized: true };
        } else {
          throw error;
        }
      })
  },options);
  
  console.log('Check point 3');
  if(!loopPreventor && isUnauthorized) {
    loopPreventor = true;
    let updatedToken = yield Episode7.call(
      updateToken,
      pvsUrl,
      accountId,
      privateKey
    );

  console.log('Check point 4');
    let visionApiResult = yield Episode7.call( 
      queryVisionApi,
      pvsUrl,
      resizedImgUrl,
      modelId
    );
    setTimeout(()=>{loopPreventor = false},1000);
    return visionApiResult;
  } else {
    return body;
  }
}

module.exports = queryVisionApi;
