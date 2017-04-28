'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
const request = require('request')

// route functions
const hardcodedLocation = require('./routes/hardcodedGeoRoute.js').hardcodedLocation
const ipGeo = require('./routes/ipGeoRoute.js')

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users
      
let test = function() {
  let randomNum = 0;
  let state = { requested: Date.now() }
/*
ifs to determine desktop v mobile
&&
browser v slack app

*/
  slapp.command('/test', (msg, text) => {
    randomNum = (Math.floor(Math.random() * 1400) + 200)

    msg
      .say({
        text: '',
        attachments: [{
          text: 'Where do you want to Jaywalk to?',
          fallback: 'Where to today?',
          callback_id: 'doit_confirm_callback',
          actions: [{
              name: 'answer',
              text: 'Eventually gets current ip geolocation',
              type: 'button',
              value: 'ipGeo'
            },
            {
              name: 'answer',
              text: 'WeWork',
              type: 'button',
              value: 'wework'
            },
            {
              name: 'answer',
              text: 'Boomtown',
              type: 'button',
              value: 'boomtown'
            },
            {
              name: 'answer',
              text: 'Sends to app download',
              type: 'button',
              value: 'app'
            },
            {
              name: 'answer',
              text: 'randomNum',
              type: 'button',
              value: randomNum
            }        
          ]
        }]
      })
      .route('requestToDatabase', state, 60)    
  })
  .route('requestToDatabase', (msg, state) => {
    let answer = msg.body.actions[0].value

    if(answer == 'boomtown'){
      hardcodedLocation(39.758451,-105.007625) //(lat,lng) of boomtown
    }else if(answer == 'wework'){
      hardcodedLocation(40.018689, -105.279993) //test: snap #1055
    }else if(answer == 'app'){
      /*
      let device = //variable from device
        if(device == ios){
         // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")

        } else if(device == android){
  
        }
      */
       return msg.say("That doesn't work yet...")
    }else if(answer == 'ipGeo'){
      // ipGeo()
        let callback =function (data){
          console.log(JSON.stringify(data, null, 2));
        }
        request('//www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
          callback(data)
        });

    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('requestToDatabase', state, 60)
    }
  }) //end .route('requestToDatabase')
}
module.exports = {
  test:test()
}

