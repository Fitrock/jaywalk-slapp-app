const slapp = require('../../slackSetup.js').slapp
const yes = require('./yes.js').yes
let snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo

const addressToGeo = function(teamInfo,msg,state){
  msg
    .respond({
    text: "",
      attachments: [{
        title: "Where are you? Click me so I can find you or...",
        text: `Respond with an address, zipcode, business name `,
        callback_id: 'address_geo',
        color: 'warning'
      }]
  })
    // check if geoslack lat/lng or if user entered text
    .route('address_geo', state)
}

module.exports = {
  addressToGeo: addressToGeo
}

/*or <https://jaywalk-geo.herokuapp.com/geoloc.htm | click here>.*/