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

.route('appDl', (msg, state) => {
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