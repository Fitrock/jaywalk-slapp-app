'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
const request = require('request')
const where = require('node-where')

// route functions
const snapsByGeo = require('./routes/snapsByGeoRoute.js').snapsByGeo
const ipGeo = require('./routes/ipGeoRoute.js')
const routeFuncs = require('./routes/routesIndex.js')
const yes = require('./routes/yes.js').yes
const addressToGeo = require('./routes/addressToGeo.js').addressToGeo


const notify = require('./notifySlash.js').notify

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users,
      slackDb = firebase.slackDb
      
let jaywalk = function() {
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
  slapp.command('/jaywalk', (msg, text) => {
    teamInfo = slackDb
      .child(msg.body.team_id)
      .once("value")
      .then(function(obj){
        if(obj.val().lat){
          return teamInfo = obj.val()
        } else{
          // might make condition to change buttons displayed?
          // send to setup and add to db
          return teamInfo.team_id = msg.body.team_id
        }
      })
    // console.log(msg._slapp.client.channel.team)
    // console.log(msg.meta)
    msg
      .say({
        text: "",
        attachments: [{
          text: 'How can I help?',
          fallback: 'Where to today?',
          callback_id: 'jaywalk_callback',
          color: 'good',
          actions: [
            {
              name: 'answer',
              text: 'Find deals',
              type: 'button',
              value: 'address'
            },
            {
              name: 'answer',
              text: 'Notifications',
              type: 'button',
              value: 'notifications'
            },
            {
              name: 'answer',
              text: 'Settings',
              type: 'button',
              value: 'settings'
            },
            {
              name: 'answer',
              text: 'Download app',
              type: 'button',
              value: 'app'
            }      
          ]
        }]
      })
      .route('requestToDatabase', state, 60)    
  })
// slapp.action('jaywalk_callback', 'answer', (msg, value) => {
//   msg.respond(msg.body.response_url, `${value} is a good choice!`)
// })

  .route('requestToDatabase', (msg, state) => {
    // console.log(msg.type)
    // console.log(msg.body.token)
    // console.log(msg.body.message_ts)
    // console.log(msg.body.channel.id)
    if(msg.body.actions==undefined){
      msg.route('requestToDatabase', state, 60)    
    }else{
      answer = msg.body.actions[0].value
      if(answer == 'app'){
        return msg.respond({  
          text: "",
          attachments: [{
            text: '<itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8|iPhone>',
            color: 'good'
          },{
            text: '<market://play.google.com/store/apps/details?id=com.kinetise.appb3e241f4c2ebeba41965ba16c05b2eba&hl=en_GB|Android>',
            color: 'good'
          }]
        })
      }else if(answer == 'address'){
        yes(teamInfo,msg,state)
        //https://jaywalk-geo.herokuapp.com/geoloc.htm
        // .route('handleGeoLoc', state, 60) 
      }else if(answer == 'settings'){
        
      }else if(answer == 'notifications'){
        notify(teamInfo,msg,state)
      }else{ //handle error
        return msg
          .say("Whoops, you just have to pick a button...")
          .say('Click a button!')
          .route('requestToDatabase', state, 60)
      }
    } //end else(actions undefined checker)
  }) //end .route('requestToDatabase')
  .route('handleGeoLoc',(msg,state) =>{
  }) //end .route( handleGeoLoc
  .route('relaventAsk', (msg,state) => {
    routeFuncs.relaventAsk(msg,state)
  })//end .route(relaventAsk)
  .route('address_geo', (msg,state) => {
    let text = (msg.body.event && msg.body.event.text) || ''
    where.is(text,function(err,result){ 
      /*
        result.get('')=>
        address,streetNumber, street,streetAddress,city,region,
        regionCode, postalCode, country, countryCode, lat, lng
      */
      if (result) {
        let lat = result.get('lat')
        let lng = result.get('lng')
        snapsByGeo(lat,lng,msg,state)
      }
    })
  })
}
module.exports = {
  jaywalk:jaywalk()
}

