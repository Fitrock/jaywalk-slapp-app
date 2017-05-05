/*****************
Geolocation
*******************/
const express = require('express')
const request = require('request')
const where	= require('node-where')
const app = express()

var os = require('os');
var deviceIp = os.networkInterfaces();
var deviceIPV6 = deviceIp.en1[0].address
// console.log(os)



// app.post('/get/ip/address', function (req, res) {
// 	var ip = req.headers['x-forwarded-for'] || 
// 	     req.connection.remoteAddress || 
// 	     req.socket.remoteAddress ||
// 	     req.connection.socket.remoteAddress;})
// })



// where.is('63.76.231.82', function(err, result) {
//   if (result) {
//     console.log('City: ' + result.get('city'));
//     console.log('State / Region: ' + result.get('region'));
//     console.log('State / Region Code: ' + result.get('regionCode'));
//     console.log('Zip: ' + result.get('postalCode'));
//     console.log('Country: ' + result.get('country'));
//     console.log('Country Code: ' + result.get('countryCode'));
//     console.log('Lat: ' + result.get('lat'));
//     console.log('Lng: ' + result.get('lng'));
//   }
// });

// module.exports = {
    
// }



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
console.log(radius)
return 0;
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string: required for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snapArr) {
        let body
        let count = 0
        let len = snapArr.val().length
        console.log(len)
        console.log(snapArr.val())
        for(let i=len;i>=(len-4);i--){
          snap = snapArr.val()[i]
          console.log(snap)
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