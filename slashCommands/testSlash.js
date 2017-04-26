'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');
 

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users
      
let test = function() {
  let randomNum = 0;

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
              value: ''
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
              value: ''
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
      .route('requestToDatabase', {
        id: text
      })
      // if statements to route based on btn value
      /*
      .route('appDl', {
        id: text
      }) 
      .route('boomtown', {
        id: text
      }) 
      .route('ipGeo', {
        id: text
      })  
      .route('random', {
        id: text
      }) 
      .route('wework', {
        id: text
      })            
      */     
  })

  //keep .route('',blah blah)=>{
  // variable that pulls in route.js file
  // }
  .route('requestToDatabase', (msg, state) => {
    console.log(randomNum)
    // var randSnap = msg.body.actions[0].value || ''
    // var randTag = msg.body.actions[0].value || ''
    // user may not have typed text as their next action, ask again and re-route
    // if (!randSnap || !randTag) {
    //   return msg
    //     .say("Whoops, you just have to pick a button...")
    //     .say('Click a button!')
    //     .route('requestToDatabase', state)
    // }

    /*
      function to get client ip and convert to geolocation goes here

    */

    let radius = getRadius(39.752764, -104.877743) //test: snap #1055
    

    //firebase search by snap lat (start at bottom of circle, end at top)
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snap) {
        let body
        let count = 0
        snap.forEach(function(data) {
          //if returns lng within radius (east/west)
          if (data.val().lng <= radius[0].lng && data.val().lng >= radius[3].lng  && count <4) {
            // console.log(data.val().title)
            let body = data.val()
            count ++
            let callback = function(picUrl){
              msg.say({
                  text: `Deal ${count}: \n
                              ${body.description}\n
                              ${picUrl}\n
                              ${body.address}\n`
              }) //end msg.say
            }
            tinyurl.shorten(body.picture, function(res) {
              callback(res)
            })

          } //end if (lng checker)
        }) //end foreach
      }) //end .then(snap)
  }) //end .route('requestToDatabase')
}
module.exports = {
  test:test()
}

