const slapp = require('../../slackSetup.js').slapp
const yes = require('./yes.js').yes
let snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo

const addressToGeo = function(teamInfo,msg,state){
  msg
    .say({
    text: "",
      attachments: [{
        title: "Where are you? Click me so I can find you or...",
        text: `Respond with an address, zipcode, or business name or <https://jaywalk-geo.herokuapp.com/geoloc.htm | click here`.,
        callback_id: 'address_geo',
        color: 'warning'
      }]
  })
    .route('address_geo', state)
}

module.exports = {
  addressToGeo: addressToGeo
}

