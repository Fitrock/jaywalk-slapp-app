'use strict'
const slapp  = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

  

let jaywalk  = function() {
  let randomNum = 0;
  slapp.command('/jaywalk', (msg, text) => {
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
              text: 'Boomtown',
              type: 'button',
              value: 'boomtown'
            },
            {
              name: 'answer',
              text: 'WeWork',
              type: 'button',
              value: 'wework'
            }
          ]
        }]
      })
        .route('getDbinfo', {
          id: text
        })        
  })
  .route('getDbinfo', (msg, state) => {
    let answer = msg.body.actions[0].value
    // user may not have typed text as their next action, ask again and re-route
    // if (!randSnap || !randTag) {
    //   return msg
    //     .say("Whoops, you just have to pick a button...")
    //     .say('Click a button!')
    //     .route('getid1', state)
    // }
    let body
    let testSnapLocation

    if(answer == 'boomtown'){
      testSnapLocation = getRadius(39.758451,-105.007625) //test: snap #1055
    }else if(answer == 'wework'){
      testSnapLocation = getRadius(40.018689, -105.279993) //test: snap #1055
    }
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
  jaywalk: jaywalk()
}


