const slapp = require('../../slackSetup.js').slapp
const yes = require('./yes.js').yes
let snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo

const addressToGeo = function(teamInfo,msg,state){
  msg
    .say({
    text: "",
      attachments: [{
        text: `Please type an address, zipcode, or business name`,
        callback_id: 'address_geo',
        color: 'warning'
      }]
  })
  slapp.action('address_geo', (msg, value) => {
    console.log('in address_geo callback')
    console.log(msg.body.message)
    msg.say(msg.body.message)
  })
}

module.exports = {
  addressToGeo: addressToGeo
}

