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
    let radius = getRadius(lat,lng)
    let resultArr = []
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snapObj) {
        let count = 0
        snapObj.forEach(function(data) {
          let snap = data.val()
          //if returns lng within radius (east/west)
          if (snap.lng <= radius[0].lng && snap.lng >= radius[3].lng) {
            count ++
            resultArr.push(snap)
          } //end if (lng checker)
        }) //end foreach
        let len = (resultArr.length-1)
        for(let i=len;i>(len-4);i--){ //last four
          let snap = resultArr[i]

          console.log(snap)
          let callback = function(picUrl){
            msg.say({
                text: '',
                attachments:[{
                  title: `${snap.description}`,
                  color: 'warning',
                  image_url: `${picUrl}`,
                  text: `${snap.address}`,
                  footer:`Jaywalk`,
                  callback_id: "snap_callback",
                  actions:[{
                    name: 'answer',
                    text: 'Directions',
                    type: 'button',
                    value: `directions`
                  }]
                }]
            }) //end msg.say
          }
          tinyurl.shorten(snap.picture, function(res) {
            callback(res)
          })
        } //end for
      }) //end .then(snap)
} // end snapsByGeo()


slapp.action('snap_callback', 'answer', (msg, value) => {
  var start = `39.733543, -104.992554`
  var mapsize = "500x400"
  var maptype = "roadmap"
  var markerParam = "&markers=color%3Ared%7Clabel%3Aa%7Cshadow%3Atrue%7C" + start

  msg.say({
    text: 'directions api here',
    "attachments": [
      {
        "fallback": "Required plain-text summary of the attachment.",
        "color": "#36a64f",
        "title_link": "https://www.google.com/maps/place/" + start,
        "image_url": "https://maps.googleapis.com/maps/api/staticmap?size=500x400&maptype=roadmap&markers=color%3Ared%7Clabel%3Aa%7Cshadow%3Atrue%7C39.733543,%20-104.992554"
        //"thumb_url": "http://example.com/path/to/thumb.png"
         // "fields":[
         //  {
         //     "title": "Update your own location",
         //     "value": host_app_url + "",
         //     "short":false
         //  }
         // ]
      }
    ]
  })
})


module.exports = {
  snapsByGeo: snapsByGeo
}

// "https://maps.googleapis.com/maps/api/staticmap?size=500x400&maptype=roadmap&markers=color%3Ared%7Clabel%3Aa%7Cshadow%3Atrue%7C39.733543,-104.992554"


