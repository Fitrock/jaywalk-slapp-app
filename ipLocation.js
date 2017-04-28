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



