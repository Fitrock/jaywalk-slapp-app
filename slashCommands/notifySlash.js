'use strict'
const slapp  = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
const request = require('request')

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

  

let notify  = function() {
  let randomNum = 0;
  slapp.command('/jaywalkNotify', (msg, text) => {
    let state = { requested: Date.now() }


    msg
      .say({
        text: '',
        attachments: [{
          text: 'What notifications do you want on this channel?',
          fallback: 'Set timed events.',
          callback_id: 'doit_confirm_callback',
          actions: [{
              name: 'answer',
              text: 'Coffee Spots',
              type: 'button',
              value: 'breakfast'
            },
            {
              name: 'answer',
              text: 'Lunch',
              type: 'button',
              value: 'lunch'
            },
            {
              name: 'answer',
              text: 'Dinner',
              type: 'button',
              value:  'dinner'
            },
            {
              name: 'answer',
              text: 'Happy Hour',
              type: 'button',
              value: 'hh'
            },
            {
              name: 'answer',
              text: 'Weekend fun',
              type: 'button',
              value:  'party'
            }            
          ]
        }]
      })
        .route('scheduler', state, 60) //expires after 60 sec       
  })
  .route('scheduler', (msg, state) => {
    let answer = msg.body.actions[0].value
    // user may not have typed text as their next action, ask again and re-route
    // if (!randSnap || !randTag) {
    //   return msg
    //     .say("Whoops, you just have to pick a button...")
    //     .say('Click a button!')
    //     .route('getid1', state)
    // }
    if(answer == 'breakfast'){
    
      

      var options = {
          url: "https://beepboophq.com/api/v1/chronos/tasks",        
          method: "POST",
          headers: { 
            authorization: "Bearer "+process.env.BEEPBOOP_TOKEN,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
          }, 
          body: {
              "method": "POST",
              "schedule": "* 15 * * * *",
              "url":"",
              "payload":{
                "greeting": "/test"
              }
            }, json:true
          };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(response);
        console.log(body);
        msg.say(JSON.stringify(response))
      });

  
      // radius = getRadius(39.758451,-105.007625) //test: snap #1055
    }else if(answer == 'lunch'){
      msg.say({
        text: `this will set auto suggestions day-day @ 11:30am`
      })
      // radius = getRadius(40.018689, -105.279993) //test: snap #1055
    }else if(answer == 'dinner'){
      msg.say({
        text: `this will set auto suggestions day-day @ 5:30pm`
      })
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
    }else if(answer == 'hh'){
      msg.say({
        text: `this will set auto suggestions day-day @ 4:30pm`
      })
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
    }else if(answer == 'party'){
      msg.say({
        text: `this will set auto suggestions day-day @ 8:00pm`
      })
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getDbinfo', state)
    }

  })
}
module.exports = {
  notify: notify()
}


