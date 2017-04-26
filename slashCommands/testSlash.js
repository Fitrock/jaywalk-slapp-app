'use strict'
const slapp = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
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
              text: 'Suprise Me!',
              type: 'button',
              value: randomNum
            },
            {
              name: 'answer',
              text: 'test copy of button',
              type: 'button',
              value: randomNum
            }
          ]
        }]
      })
      .route('getid', {
        id: text
      })
  })
  .route('requestToDatabase', (msg, state) => {
    console.log(randomNum)
    var randSnap = msg.body.actions[0].value || ''
    var randTag = msg.body.actions[0].value || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!randSnap || !randTag) {
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('requestToDatabase', state)
    }
    let body
    let count = 0
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
        msg.say(
                // `I found a deal for you: 
                // ${body.description}\n
                // ${body.picture}\n
                // ${body.address}\n`
          snap.forEach(function(data) {
            //if returns lng within radius (east/west)
            if (data.val().lng <= radius[0].lng && data.val().lng >= radius[3].lng  && count <3) {
              // console.log(data.val().title)
              let body = data.val()
              count ++

                attachments: [{
                text: `I found some deals for you: `,
                // fallback: 'Where to today?',
                // callback_id: 'doit_confirm_callback',
                actions: [{
                    name: 'answer',
                    text: ``,
                    type: 'text',
                    value: randomNum
                    },
                    {
                      name: 'answer',
                      text: 'copy of button',
                      type: 'button',
                      value: randomNum
                    }
                  ]
                }] //end attachments
            } //end if (lng checker)
          }) //end foreach
        ) //end msg.say

      }) //end .then(snap)
    }) //end .route('requestToDatabase')
}
module.exports = {
  test:test()
}

