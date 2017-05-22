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

let teamObj

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
    text: `Current walking conditions: `,
    title: "Where to today?",
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
      },{
        name: 'answer',
        text: 'testing new db',
        type: 'button',
        value: 'testing'
      }     
    ]
  }]
}

let newTeamCallback = (msg,state)=>{
  msg
    .say({ text:`Welcome to Jaywalk! To get better results, please enter the address or your buisness name and city.`})    
    .route('setup', state)  
}
let oldTeamCallback = (msg,state)=>{
  jayBtns.text = state.climate.weather
  msg
  .say(jayBtns)
  .route('mainBtnAnswer', state, 30)  
}

let saveToDb = (lat,lng,address,msg,state)=>{
  console.log(msg.body)
  console.log(msg.meta)
  teamObj={  
    team_id: msg.body.team_id,
    team_name: msg.meta.team_domain,
    lat:lat,
    lng:lng,
    address: address,
    slack_token: msg.meta.verify_token, //given at auth
    bot_token: msg.meta.bot_token,
    app_token: msg.meta.app_token,
    webhook: msg.meta.incoming_webhook_url,
    channel_name:state.channel_name
  }
  state.teamInfo=teamObj
  slackDb.child(teamObj.team_id).set(teamObj)
  // .then(function)
  jayBtns.attachments.text = state.climate.weather
  msg
  .respond(jayBtns)
  .route('mainBtnAnswer', state, 30)  
}

const jaywalk = function() {
  let state = { requested: Date.now() }
  let teamId = ''
  let teamInfo = {}
  let answer


  slapp.command('/jaywalk', (msg, state) => {
    state={}
    state = { requested: Date.now() }
    state.channel_name= msg.body.channel_name
    teamId = ''
    teamInfo = {}

    // console.log(msg.body)
    teamInfo = slackDb
      .child(msg.body.team_id)
      .once("value")
      .then(function(obj){
        if(obj.val()==null){
          newTeamCallback(msg,state)
        }else if(obj.val()){
          state.teamInfo = obj.val()
          var options = { method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather',
            qs: 
             { lat: state.teamInfo.lat,
               lon: state.teamInfo.lng,
               APPID: process.env.WEATHER_KEY },
            headers: 
             { 'cache-control': 'no-cache',
               'content-type': 'application/json' } };

          request(options, function (error, response, body) {
            if (error) throw new Error(error);
            state.climate = body
            console.log(body);
            oldTeamCallback(msg,state)
          });
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
        appDl(msg,state)
      }else if(answer == 'address'){
        yes(msg,state)
      }else if(answer == 'settings'){
        teamSettings(msg,state)
      }else if(answer == 'testing'){
        var options = {
          method: 'GET',
          url: 'https://dev.jaywalk.me/api/spots/',
          qs: { page: '1',lat: 40.70960676488003000,lng:-73.98554774293002000 },//lat: `${teamInfo.lat}`,lng:`${teamInfo.lng}`
          headers: 
           { 'cache-control': 'no-cache',
             'content-type': 'application/json' }
          };
          request(options, function (error, response, body) {
            let res = JSON.parse(body).results
            console.log(res)
            if (error) throw new Error(error);
            msg.respond({
              text:``,
              attachments:[{
                text:`search by lat/lng:${res}`,
                color: `danger`,
                image_url:`${res[0].image_original}`,
                fields:{
                  short:true,
                  title:`From:${res[0].user.username}`,
                  value:`${res[0].tags}`
                }
              }]
            })
          })
      }else{ //handle error
        return msg
          .say("Whoops, you just have to pick a button...")
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
        let address = result.get('address')
      // slackDb.child(msg.body.team_id).set(teamObj)
  //           oldTeamCallback(msg,state)
        saveToDb(lat,lng,address,msg,state)

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

slapp.action('notification_callback', 'answer', (msg, value) => {
  let state={}
  state = { requested: Date.now() }
  slackDb
  .child(msg.meta.team_id)
  .once("value")
  .then(function(obj){
    state.teamInfo = obj.val()
    yes(msg,state)
  })


  // msg.respond({
  //   text: value
  // })

  //add lat/lng and team info to state

})
module.exports = {
  jaywalk:jaywalk(),
  jayBtns:jayBtns
}

