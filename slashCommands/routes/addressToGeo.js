const yes = require('./yes.js').yes
let snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo

const addressToGeo = function(teamInfo,msg,state){
  msg
    .say({
    text: "",
      attachments: [{
        text: `Please type an address, zipcode, or business name`,
        callback_id: 'yesno_callback',
        color: 'warning'
      }]
  })
    .route('address_geo', state)

    msg
    .route('address_geo', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''
      console.log(text)
    })
}

module.exports = {
  addressToGeo: addressToGeo
}

