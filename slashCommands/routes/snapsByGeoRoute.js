'use strict'
const slapp = require('../../slackSetup.js').slapp
const getRadius = require('../../radius.js').getRadius
const tinyurl = require('tinyurl');
const routeFuncs = require('./routesIndex.js')


//db imports
const firebase    = require('../../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

function snapsByGeo (lat,lng, msg, state){
    //firebase search by snap lat (start at bottom of circle, end at top)
    let radius = getRadius(lat,lng) //test: snap #1055

    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snapObj) {
        let count = 0
        snapObj.forEach(function(data) {
          let snap = data.val()
          // console.log(snap)
          //if returns lng within radius (east/west)
             console.log(snap.lng,'>',radius[0].lng)
            console.log(snap.lng,'<',radius[3].lng)
          if (snap.lng >= radius[0].lng && snap.lng <= radius[3].lng) {
            console.log(snap.lng,'>',radius[0].lng)
            console.log(snap.lng,'<',radius[3].lng)
            // console.log(data.val().title)
            count ++
            let thisCount = count
            let callback = function(picUrl){
              msg.say({
                  text: '',
                  attachments:[{
                    title: `${snap.description}`,
                    color: 'warning',
                    image_url: `${picUrl}`,
                    thumb_url: `${picUrl}`,
                    text: `${snap.address}`,
                    footer:`Jaywalk: ${thisCount}`
                  }]
              }) //end msg.say
              .route('relaventAsk', (msg,state),60)
            }
            tinyurl.shorten(snap.picture, function(res) {
              // callback(res)
            })
          } //end if (lng checker)
        }) //end foreach
      }) //end .then(snap)
} // end snapsByGeo()

module.exports = {
  snapsByGeo: snapsByGeo
}