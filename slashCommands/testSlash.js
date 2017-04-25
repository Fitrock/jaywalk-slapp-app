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
              text: 'copy of button',
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
    let radius = getRadius(39.752764, -104.877743) //test: snap #1055
    

// Get client IP address from request object ----------------------
getClientAddress = function (req) {
  console.log(req.connection.remoteAddress)
        return (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;
};
console.log(getClientAddress())

//firebase search by snap lat (start at bottom of circle, end at top)
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snap) {
        snap.forEach(function(data) {
          //if returns lng within radius (east/west)
          if (data.val().lng <= radius[0].lng && data.val().lng >= radius[3].lng) {
            console.log(data.val().title)
            let body = data.val()
            msg.say(```
              I found a deal for you: 
              ${body.description}\n
              ${body.picture}\n
              ${body.address}\n
              ```)
          }
        })
      })
    })
}
module.exports = {
  test:test()
}

