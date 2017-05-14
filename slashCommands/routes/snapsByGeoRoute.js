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

let attachmentArr = []


let callback = function(picUrl,snap,normalIndex){
  console.log('callback',i)
  let snapAttach={
    title: `${snap.description}`,
    image_url: `${picUrl}`,
    text: `${snap.address}`,
    footer:`Jaywalk`
  }
  attachmentArr.push(snapAttach)
  if(normalIndex==4){
    msg.respond({
        text: '',
        attachments:[{
          color: 'warning',
          callback_id: "relaventAsk_callback",
          author_name:"Jaywalk",
          author_link:"http://www.jaywalk.me",
          fields: attachmentArr
        }]
    }) //end msg.say
    .route('relaventAsk', (msg,state),60)
  }
}
let msgCallback = function(){

}

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
        let normalIndex = 0;

        for(let i=len;i>(len-4);i--){ //last four
          normalIndex ++
          let snap = resultArr[i]
          console.log(i,'first for')
          tinyurl.shorten(snap.picture, function(res) {
            callback(res,snap,i,normalIndex)
          })
        } //end for

      }) //end .then(snap)
} // end snapsByGeo()

module.exports = {
  snapsByGeo: snapsByGeo
}
