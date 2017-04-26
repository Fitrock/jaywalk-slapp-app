'use strict'
const slapp  = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

  

let jaywalk  = function() {
  let randomNum = 0;
  slapp.command('/jaywalk', (msg, text) => {
    let state = { requested: Date.now() }

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
            },
            {
              name: 'answer',
              text: 'Download App',
              type: 'button',
              value:  'app'

            }
          ]
        }]
      })
        .route('getDbinfo', state, 60) //expires after 60 sec       
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
    let radius
//itms://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8
    if(answer == 'boomtown'){
      radius = getRadius(39.758451,-105.007625) //test: snap #1055
    }else if(answer == 'wework'){
      radius = getRadius(40.018689, -105.279993) //test: snap #1055
    }else if(answer == 'app'){
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")

    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getDbinfo', state)
    }
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string for query
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
            let thisCount = count
            count ++
            let callback = function(picUrl){
              msg.say({
                  text: `Deal ${thisCount}: \n
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
      }) //end .then
  })
}
module.exports = {
  jaywalk: jaywalk()
}


