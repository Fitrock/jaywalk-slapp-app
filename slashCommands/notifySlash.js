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
      users = firebase.users,
      notifications = firebase.notifications

let options = {
          url: "https://beepboophq.com/api/v1/chronos/tasks",        
          method: "POST",
          headers: { 
            authorization: "Bearer "+process.env.BEEPBOOP_TOKEN,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
          }, 
          body: {
              "method": "POST",
              "schedule": "",
              "url":"https://hooks.slack.com/services/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",
              "payload":{
                "text": ""
              }
            }, json:true
          };

function setCron(options,answer,time,msg){
  options.body.payload.text = `If you would like ${answer} suggestions type /${answer}`
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    // msg.say(JSON.stringify(response))
    msg.say(`${answer} set at ${time}`)
  });
}

let notify  = function(teamInfo,msg,state) {
      msg
      .respond({
        text: '',
        attachments: [{
          text: 'What notifications do you want on this channel?',
          fallback: 'Set timed events.',
          callback_id: 'scheduler_callback',
          actions: [{
              name: 'answer',
              text: 'Coffee Spots',
              type: 'button',
              value: 'Breakfast'
            },
            {
              name: 'answer',
              text: 'Lunch',
              type: 'button',
              value: 'Lunch'
            },
            {
              name: 'answer',
              text: 'Dinner',
              type: 'button',
              value: 'Dinner'
            },
            {
              name: 'answer',
              text: 'Happy Hour',
              type: 'button',
              value: 'Happy Hour'
            },
            {
              name: 'answer',
              text: 'Weekend fun',
              type: 'button',
              value: 'Local Bar'
            }            
          ]
        }]
      })
  slapp.action('scheduler_callback', 'answer', (msg, value) => {
    let team = {team_id:teamInfo.team_id,webhook:teamInfo.webhook,bot_token: msg.meta.bot_token}
    // msg.respond(msg.body.response_url, `${value} is a good choice!`)
    // user may not have typed text as their next action, ask again and re-route
    // if (!randSnap || !randTag) {
    //   return msg
    //     .say("Whoops, you just have to pick a button...")
    //     .say('Click a button!')
    //     .route('getid1', state)
    // }
    if(value == 'Breakfast'){    
    //need to handle timezones.... 
      /*
      ! Based on UTC time (GMT +06:00:00) or utc is denver+6hours
        min 0-59
        hour 0-23
        day of month 1-31
        month 1-12
        day of week 0-6 (sun-sat)
        year 2016-9999
      */
      notifications.child('coffee').child(team.team_id).set(team)
      options.body.schedule = "0 13 * * 1-5 *" // mon-fri @ 7:00am gmt
      let time = "mon-fri @ 7:00am gmt"
      // setCron(options,value,time,msg)
    }else if(value == 'Lunch'){
      notifications.child('lunch').child(team.team_id).set(team)
      options.body.schedule = "30 17 * * 1-5 *" // mon-fri @ 11:30am gmt
      let time = "mon-fri @ 11:30am gmt"
      // setCron(options,value,time,msg)
    }else if(value == 'Dinner'){
      notifications.child('dinner').child(team.team_id).set(team)
      options.body.schedule = "30 23 * * 1-5 *" // mon-fri @ 5:30pm gmt
      let time = "mon-fri @ 5:30pm gmt"
      // setCron(options,value,time,msg)
    }else if(value == 'Happy Hour'){
      notifications.child('hh').child(team.team_id).set(team)
      options.body.schedule = "30 22 * * 1-5 *" // mon-fri @ 4:30pm gmt
      let time = "mon-fri @ 4:30pm gmt"
      // setCron(options,value,time,msg)
    }else if(value == 'Local Bar'){
      notifications.child('bar').child(team.team_id).set(team)
      options.body.schedule = "0 02 * * 0,5,6 *" // thurs-sat @ 8:00pm gmt
      let time = "mon-fri @ 8:00pm gmt"
      // setCron(options,value,time,msg)
    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getDbinfo', state)
    }

  })
}
module.exports = {
  notify: notify
}


