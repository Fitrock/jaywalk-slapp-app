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
    let radius = getRadius(39.758451,-105.007625) //test: snap #1055

    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snaps) {
        let body
        let count = 0
        let len = snaps.length
        for(let i=len;i>=len-4;i--){
          snap = snaps[i].val()
          //if returns lng within radius (east/west)
          if (snap.lng <= radius[0].lng && snap.lng >= radius[3].lng) {
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
              callback(res)
            })
          } //end if (lng checker)
        } //end for
      }) //end .then(snap)
} // end snapsByGeo()

module.exports = {
  snapsByGeo: snapsByGeo
}