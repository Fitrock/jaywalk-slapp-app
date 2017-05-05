'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
const request = require('request')

// route functions
const snapsByGeo = require('./routes/snapsByGeoRoute.js').snapsByGeo
const ipGeo = require('./routes/ipGeoRoute.js')
const routeFuncs = require('./routes/routesIndex.js')

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users,
      slackDb = firebase.slackDb
      
let test = function() {
  let state = { requested: Date.now() }
  let teamId = ''
  let teamInfo = {}
  let answer
  /*
  ifs to determine desktop v mobile
  &&
  browser v slack app
  body.
    token: '', // same as verify_token
    team_id: '',
    team_domain: '',
    channel_id: '',
    channel_name: '',
    user_id: '',
    user_name: ''
  ._slapp.client: 
   { api: [Object],
     auth: [Object],
     bots: [Object],
     channels: [Object],
     chat: [Object],
     dnd: [Object],
     emoji: [Object],
     files: [Object],
     groups: [Object],
     im: [Object],
     mpim: [Object],
     oauth: [Object],
     reactions: [Object],
     reminders: [Object],
     pins: [Object],
     rtm: [Object],
     search: [Object],
     stars: [Object],
     team: [Object],
     usergroups: [Object],
     users: [Object] },
  .meta: 
    { app_token: '',
      app_user_id: '',
      app_bot_id: '',
      bot_token: '',
      bot_user_id: '',
      bot_user_name: '',
      team_name: '',
      team_domain: '',
      team_resource_id: '',
      error: undefined,
      config: {} },
  */
  slapp.command('/test', (msg, text) => {
    teamInfo = slackDb
      .child(msg.body.team_id)
      .once("value")
      .then(function(obj){
        if(obj.val().lat){
          return teamInfo = obj.val()
        } else{
          // might make condition to change buttons displayed?
          return teamInfo.team_id = msg.body.team_id
        }
      })
    // console.log(msg._slapp.client.channel.team)
    // console.log(msg.meta)
    msg
      .say({
        text: "",
        attachments: [{
          text: 'Where do you want to Jaywalk to?',
          fallback: 'Where to today?',
          callback_id: 'test_callback',
          color: 'good',
          actions: [
          // {
          //     name: 'answer',
          //     text: 'Eventually gets current ip geolocation',
          //     type: 'button',
          //     value: 'ipGeo'
          //   },
            {
              name: 'answer',
              text: 'identity',
              type: 'button',
              value: 'address'
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
              text: 'Download app',
              type: 'button',
              value: 'app'
            },
            {
              name: 'answer',
              text: 'findMe',
              type: 'button',
              value: 'findMe'
            }      
          ]
        }]
      })
      .route('requestToDatabase', state, 60)    
  })
// slapp.action('test_callback', 'answer', (msg, value) => {
//   msg.respond(msg.body.response_url, `${value} is a good choice!`)
// })

  .route('requestToDatabase', (msg, state) => {
    answer = msg.body.actions[0].value
    // if(msg.body.action==undefined){
    //   msg
    //     .say('Click a button!')
    //     .route('requestToDatabase', state, 60)
    // } else{
    //   answer = msg.body.actions[0].value
    // }

    if(answer == 'boomtown'){
      // if(1==0){
      //   // if location is not set -> set perm. location? or where are you?
      // } 
      // if(teamInfo.lat){ //db had location stored for team
        // msg.say({
        // text: "",
        //   attachments: [{
        //     text: `Are you at ${teamInfo.location_name}?`,
        //     fallback: 'Where to today?',
        //     callback_id: 'yesno_callback',
        //     color: 'good',
        //     actions: 
        //     [{
        //       name: 'answer',
        //       text: 'Yes',
        //       type: 'button',
        //       value: 'yes'
        //     },{ 
        //       name: 'answer',
        //       text: 'No',
        //       type: 'button',
        //       value: 'no'
        //     }]
        //   }]
        // })
        // slapp.action('yesno_callback', 'answer', (msg, value) => {
        //   msg.respond(msg.body.response_url, `${value} is a good choice!`)
        // })
        // if(msg.body.actions[0].value=="yes"){
          console.log(teamInfo)
          // snapsByGeo(teamInfo.lat,teamInfo.lng, msg, state) 
        // } else {
        //   msg.say('still working on that')
        // }
      // }

      // get team_id.location(lat,lng) => ask if they are at that location
      // if no => enter address, zip, or business name
        // snapsByGeo(39.758451,-105.007625, msg, state) //(lat,lng) of boomtown
      // }
    }else if(answer == 'wework'){
      snapsByGeo(40.018689, -105.279993, msg, state) //test: snap #1055
    }else if(answer == 'app'){
      /*
      let device = //variable from device
        if(device == ios){
         // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")

        } else if(device == android){
  
        }
      */
      return msg.say({  
        text: "",      
        attachments: [{
          text: '<itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8|iPhone>',
          callback_id: 'doit_confirm_callback',
          thumb_url: 'https://goo.gl/images/famYEL',
          color: 'good'
        },{
          text: '<market://play.google.com/store/apps/details?id=com.kinetise.appb3e241f4c2ebeba41965ba16c05b2eba&hl=en_GB|Android>',
          callback_id: 'doit_confirm_callback',
          color: 'good'
        }]
      })
    }else if(answer == 'ipGeo'){
      // ipGeo()
      let callback =function(err,res){
      console.log(err,res)
      msg.say(JSON.stringify(res),"this is slack's server location...")
      }

      request.get({
        uri:'http://www.geoplugin.net/json.gp',
        json:true}
        , callback);

    }else if(answer == 'findMe'){
      msg
      .say('<https://jaywalk-geo.herokuapp.com/geoloc.htm|Find me>')//https://jaywalk-geo.herokuapp.com/geoloc.htm
      .route('handleGeoLoc', state, 60) 
    }else if(answer == 'address'){
      msg
      .say('')//https://jaywalk-geo.herokuapp.com/geoloc.htm
      .route('handleGeoLoc', state, 60) 
    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('requestToDatabase', state, 60)
    }
  }) //end .route('requestToDatabase')
  .route('handleGeoLoc',(msg,state) =>{

  }) //end .route( handleGeoLoc
  .route('relaventAsk', (msg,state) => {
    routeFuncs.relaventAsk(msg,state)
  })//end .route(relaventAsk)
}
module.exports = {
  test:test()
}

