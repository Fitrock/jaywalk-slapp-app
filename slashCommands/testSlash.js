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
            {
              name: 'answer',
              text: 'address',
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
              name: 'answer', //probably switching to addressToGeo
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
    if(answer == 'boomtown'){
      snapsByGeo(teamInfo.lat,teamInfo.lng, msg, state)     
    }else if(answer == 'wework'){
      snapsByGeo(39.758451,-105.007625, msg, state) //test: snap #1055
    }else if(answer == 'app'){
      return msg.say({  
        text: "",      
        attachments: [{
          text: '<itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8|iPhone>',
          color: 'good'
        },{
          text: '<market://play.google.com/store/apps/details?id=com.kinetise.appb3e241f4c2ebeba41965ba16c05b2eba&hl=en_GB|Android>',
          color: 'good'
        }]
      })
    }else if(answer == 'findMe'){
      msg
      .say('<https://jaywalk-geo.herokuapp.com/geoloc.htm|Find me>')//https://jaywalk-geo.herokuapp.com/geoloc.htm
      .route('handleGeoLoc', state, 60) 
    }else if(answer == 'address'){
      yes(teamInfo,msg,state)
      //https://jaywalk-geo.herokuapp.com/geoloc.htm
      // .route('handleGeoLoc', state, 60) 
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
  .route('address_geo', (msg,state) => {
    let text = (msg.body.event && msg.body.event.text) || ''
    where.is(text,function(err,result){
      if (result) {
        // msg.say('Address: ' + result.get('address'));
        // msg.say('Street Number: ' + result.get('streetNumber'));
        // msg.say('Street: ' + result.get('street'));
        // msg.say('Full Street: ' + result.get('streetAddress'));
        // msg.say('City: ' + result.get('city'));
        // msg.say('State / Region: ' + result.get('region'));
        // msg.say('State / Region Code: ' + result.get('regionCode'));
        // msg.say('Zip: ' + result.get('postalCode'));
        // msg.say('Country: ' + result.get('country'));
        // msg.say('Country Code: ' + result.get('countryCode'));
        // msg.say('Lat: ' + result.get('lat'));
        // msg.say('Lng: ' + result.get('lng'));
        snapsByGeo(result.lat,result.lng,msg,state)
      }
    })
  })
}
module.exports = {
  test:test()
}

