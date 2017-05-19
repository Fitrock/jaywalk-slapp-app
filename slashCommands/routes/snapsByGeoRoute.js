'use strict'
const slapp = require('../../slackSetup.js').slapp
const getRadius = require('../../radius.js').getRadius
const getMap = require('../../directionsApi.js').getMap
const tinyurl = require('tinyurl');
const routeFuncs = require('./routesIndex.js')


//db imports
const firebase    = require('../../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users
let teamLat,teamLng
function snapsByGeo (lat,lng, msg, state){
  teamLat = lat
  teamLng = lng
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
          if ((snap.lng <= radius[0].lng) && (snap.lng >= radius[3].lng)) {
            console.log(snap.lng,'<',radius[0].lng)
            console.log(snap.lng,'>',radius[3].lng)
            count ++
            resultArr.push(snap)
          } //end if (lng checker)
        }) //end foreach
        let len = (resultArr.length-1)
        for(let i=len;i>(len-4);i--){ //last four
          let snap = resultArr[i]

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
                    value: `${snap.lat},${snap.lng}`
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
  var start = `${teamLat},${teamLng}`
  console.log(start)
  var end = value
  // var mapsize = "500x400"
  // var maptype = "roadmap"
  // var markerParam = "&markers=color%3Ared%7Clabel%3Aa%7Cshadow%3Atrue%7C" + start
  getMap(start,end,msg,state)


})


module.exports = {
  snapsByGeo: snapsByGeo
}

// "https://maps.googleapis.com/maps/api/staticmap?size=500x400&maptype=roadmap&markers=color%3Ared%7Clabel%3Aa%7Cshadow%3Atrue%7C39.733543,-104.992554"


