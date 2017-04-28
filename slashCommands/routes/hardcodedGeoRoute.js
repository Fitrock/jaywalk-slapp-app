'use strict'
const slapp = require('../../slackSetup.js').slapp
const getRadius = require('../../radius.js').getRadius
const tinyurl = require('tinyurl');
 

//db imports
const firebase    = require('../../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

export function hardcodedLocation (lat,lng){
    //firebase search by snap lat (start at bottom of circle, end at top)
    let radius = getRadius(39.758451,-105.007625) //test: snap #1055

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
                  text: {`Deal ${count}: \n ${body.description}\n ${picUrl}\n ${body.address}\n`}
              }) //end msg.say
            }
            tinyurl.shorten(body.picture, function(res) {
              callback(res)
            })

          } //end if (lng checker)
        }) //end foreach
      }) //end .then(snap)
} // end hardcodedLocation()