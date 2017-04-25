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
            }
            // { name: 'answer', text: 'Random Tag', type: 'button', value: Math.floor(Math.random() * 44) }
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
    let testSnapLocation = getRadius(39.752764, -104.877743) //test: snap #1055
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(testSnapLocation[5].lat + "-") // "-"makes a string for query
      .endAt(testSnapLocation[1].lat + "-")
      .once('value')
      .then(function(snap) {
        snap.forEach(function(data) {
          if (data.val().lng <= testSnapLocation[0].lng && data.val().lng >= testSnapLocation[3].lng) {
            console.log(data.val().title)
            let body = data.val()
            msg.say(`I found a deal for you: ${body.title}\n${body.description}\n${body.picture}\n${body.address}\n`)
          }
        })
      })
    })
}
module.exports = {
  test:test()
}

