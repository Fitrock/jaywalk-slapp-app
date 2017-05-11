'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
const request = require('request')
const where = require('node-where')

// route functions
const snapsByGeo = require('./routes/snapsByGeoRoute.js').snapsByGeo
const routeFuncs = require('./routes/routesIndex.js')
const yes = require('./routes/yes.js').yes
const addressToGeo = require('./routes/addressToGeo.js').addressToGeo
const appDl = require('./routes/appDlRoute.js').appDl
const teamSettings = require('../teamSettings.js').teamSettings

const notify = require('./notifySlash.js').notify

let teamInfo,teamObj

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users,
      slackDb = firebase.slackDb

let jayBtns={
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
      },{
        name: 'answer',
        text: 'Settings',
        type: 'button',
        value: 'settings'
      },{
        name: 'answer',
        text: 'Download app',
        type: 'button',
        value: 'app'
      }      
    ]
  }]
}

let newTeamCallback = (msg,state)=>{
  teamObj={  
    team_id: msg.body.team_id,
    team_name: msg.body.team_domain,
    lat:"",
    lng:"",
    slack_token: msg.body.token, //given at auth
    bot_token: "",
    webhook: msg.meta.incoming_webhook_url
  }
  // slackDb.child(msg.body.team_id).set(teamObj)
  msg
    .say({ text:`Welcome to Jaywalk! To get better results, please enter the address or your buisness name and city.`})    
    .route('setup', state)  
}
let oldTeamCallback = (msg,state)=>{
  msg
  .say(jayBtns)
  .route('mainBtnAnswer', state, 30)  
}

let saveToDb = (lat,lng,msg,state)=>{
console.log('msg',msg)
console.log('state',state)

console.log(lat,lng)
  msg
  .say({text: `lat:${lat} lng:${lng}`})
}

const jaywalk = function() {
  let state = { requested: Date.now() }
  let teamId = ''
  let teamInfo = {}
  let answer


  slapp.command('/jaywalk', (msg, text) => {
    teamInfo = slackDb
      .child(msg.body.team_id)
      .once("value")
      .then(function(obj){
        if(obj.val()==null){
          newTeamCallback(msg,state)
        }else if(obj.val()){
          teamInfo = obj.val()
          oldTeamCallback(msg,state)
        }
      })
  })

// slapp.action('jaywalk_callback', 'answer', (msg, value) => {

  .route('mainBtnAnswer', (msg, state) => { //
    if(msg.body.actions==undefined){      // try callback then remove this
      msg.route('mainBtnAnswer', state, 30)    
    }else{
      answer = msg.body.actions[0].value
      if(answer == 'app'){
        appDl(teamInfo,msg,state)
      }else if(answer == 'address'){
        yes(teamInfo,msg,state)
        //https://jaywalk-geo.herokuapp.com/geoloc.htm
        // .route('handleGeoLoc', state, 60) 
      }else if(answer == 'settings'){
        teamSettings(teamInfo,msg,state)
      }else if(answer == 'notifications'){
        notify(teamInfo,msg,state)
      }else{ //handle error
        return msg
          .say("Whoops, you just have to pick a button...")
          .say('Click a button!')
          .route('mainBtnAnswer', state, 30)
      }
    } //end else(actions undefined checker)
  }) //end .route('mainBtnAnswer')
  // }) //end callback
  .route('setup', (msg,state) => {
    let text = (msg.body.event && msg.body.event.text) || ''
    console.log(text)
    state.newAddress = text
      where.is(text,function(err,result){ 
      /*
        result.get('')=>
        address,streetNumber, street,streetAddress,city,region,
        regionCode, postalCode, country, countryCode, lat, lng
      */
      if (result) {
        let lat = result.get('lat')
        let lng = result.get('lng')
        console.log(lat,lng)
      // slackDb.child(msg.body.team_id).set(teamObj)
  //           oldTeamCallback(msg,state)
        saveToDb(lat,lng,msg,state)

      }
    })
  })//end .route(setup)
  .route('relaventAsk', (msg,state) => {
    msg.say({text: 'relaventAsk'})
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
  jaywalk:jaywalk(),
  jayBtns:jayBtns
}

