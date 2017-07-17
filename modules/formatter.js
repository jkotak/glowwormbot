"use strict";

let moment = require("moment"),
    numeral = require("numeral");

exports.formatProducts = products => {
    let elements = [];
    if(products.length==0){
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Sorry, I was unable to find a match!",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Contact Me",
                            "payload": "contact_me"
                        }]
                }
            }
        };
    }else{
        products.forEach(product => {
                elements.push({
                    title: product.get("product_category"),
                    subtitle: `${product.get("product_description")} · ${numeral(product.get("price_top_range")).format('$0,0')}-${numeral(product.get("price_bottom_range")).format('$0,0')}`,
                    "image_url": product.get("product_photo_url"),
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "View More Options",
                            "payload": "schedule_visit," + product._id
                        },
                        {
                            "type": "postback",
                            "title": "Contact Me",
                            "payload": "contact_broker," + product._id
                        },
                        {
                            "type": "postback",
                            "title": "Incorrect Result",
                            "payload": "contact_me," + product._id
                        }
                    ]
                })
            }
        );
        return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": elements
                }
            }
        };
    }
};


exports.requestLocation = location => {
    return {
        "text":"Please share your location:",
        "quick_replies":[
          {
              "content_type":"location",
              "title":"Send Location",
              "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_LOCATION"
          }
        ]
    };
};



exports.formatProducts = products => {
    let elements = [];
    products.forEach(product => {
            elements.push({
                title: product.get("Product_Name__c"),
                subtitle: `Rate ${product.get("rate__c")}%  · APR ${product.get("apr__c")}%`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Contact loan officer",
                        "payload": "contact_me," + product.getId()
                    }
                ]
            })
        }
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
    
};

exports.formatLoanAccountLinking = () =>{
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Happy to, but before I can provide you with the status, could you click below to authenticate yourself? Since this is a demo, use username 'borrower@mmaster.demo' and password 'salesforce4'",
                "buttons": [
                    {  
                    "type":"account_link",
                    "url":"https://mortgagecommunitydemo-15801ffe7f4.force.com/realtors/FBCommunitiesLoginPage?startURL=FBRedirect"
                    }
                ]
            }
        }
    };
};

exports.formatPriceChanges = priceChanges => {
    let elements = [];
    priceChanges.forEach(priceChange => {
            let property = priceChange.get("Parent");
            elements.push({
                title: `${property.Address__c}, ${property.City__c} ${property.State__c}`,
                subtitle: `Old price: ${numeral(priceChange.get("OldValue")).format('$0,0')} · New price: ${numeral(priceChange.get("NewValue")).format('$0,0')} on ${moment(priceChange.get("CreatedDate")).format("MMM Do")}`,
                "image_url": property.Picture__c,
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Schedule visit",
                        "payload": "schedule_visit," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "View realtor info",
                        "payload": "contact_broker," + property.Id
                    },
                    {
                        "type": "postback",
                        "title": "Contact loan officer",
                        "payload": "contact_me," + property.Id
                    }
                ]
            })
        }
    );
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};

exports.formatTransferAgent =()=>{
    return {
        "text":"Do you want me to transfer you to a live agent?",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Transfer me",
            "payload":"Transfer"
          },
          {
            "content_type":"text",
            "title":"Continue with bot",
            "payload":"Continue"
          }
        ]
    }
}

exports.formatAppointment = property => {
    var options = [
        moment().add(1, 'days').format('ddd MMM Do') + ' at 10am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 9am',
        moment().add(2, 'days').format('ddd MMM Do') + ' at 5pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 1pm',
        moment().add(3, 'days').format('ddd MMM Do') + ' at 6pm',
    ];
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": `Select one of the available appointments below at ${property.get("Address__c")} in ${property.get("City__c")}.`,
                "buttons": [
                    {
                        "type": "postback",
                        "title": options[0],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[0]
                    },
                    {
                        "type": "postback",
                        "title": options[1],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[1]
                    },
                    {
                        "type": "postback",
                        "title": options[2],
                        "payload": "confirm_visit," + property.get("Address__c") + " in " + property.get("City__c") + "," + options[2]
                    }]
            }
        }
    };
};

exports.formatBroker = broker => {
    let elements = [];
    elements.push({
        title: "Stephanie Diebel",
        subtitle: "Senior Realtor  · 617-219-6363 · kotakj@gmail.com",
        "image_url": "https://s3-us-west-1.amazonaws.com/sfdc-demo/messenger/caroline_500x260.png",
        "buttons": [
            {
                "type": "postback",
                "title": "Contact Me",
                "payload": "contact_me"
            }]
    });
    return {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": elements
            }
        }
    };
};



exports.formatQuickReplies =(text,postback,options)=>{  
    let elements = [];
    for (var i = 0; i < options.length; i++) { 
        elements.push({  
            "content_type":"text",
            "title":options[i],
            "payload": postback[i]
        });
    }
    return {
        "text":text,
        "quick_replies":elements
    };
};

exports.contactLoanOfficer = () => {
     return {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Unfortunately I am unable to take your loan application. Do you want me to ask a loan officer to contact you?",
                    "buttons": [
                        {
                            "type": "postback",
                            "title": "Contact Loan Officer",
                            "payload": "contact_me"
                        }]
                }
          }
     };
    
};
    
    
