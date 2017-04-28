'use strict'
const slapp = require('../../slackSetup.js').slapp
const getRadius = require('../../.radius.js').getRadius
const tinyurl = require('tinyurl');
 

//db imports
const firebase    = require('../../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users
function getClientIp(){
  /*
run in client's browser

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;
//pos returns altitude,Accuracy,heading,latitude,longitude,speed

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

navigator.geolocation.getCurrentPosition(success, error, options);
  */
   /*
    function to get client ip and convert to geolocation goes here

  */
  //geoplugin to run in client's slack and return json to backend
  //http://www.geoplugin.net/json.gp
  return [lat,lng]
}
function ipGeo() {
  let latLng =  getClientIp()
  let radius = getRadius(latLng[0], latLng[1]) //returned from getClientIp()
  

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
                text: `Deal ${(count+1)}: \n
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
    console.log('might need to return msg', msg)
}) //end ipGeo()

module.exports = {
  ipGeo: ipGeo
}