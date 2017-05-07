const yes = require('./yes.js').yes
const snapsByGeo = require('./snapsByGeo.js').snapsByGeo

const addressToGeo = function(teamInfo,msg,state){
  let location = teamInfo.location_name
  let yesno = yes(location, msg, state)
  if(yesno == true){ //they are still at the default location
    snapsByGeo(teamInfo.lat,teamInfo.lng, msg, state)     
  } else { //they need to enter new location
    msg
      .route('ask_address')
  }

    msg.route('ask_address', (msg, state) => {
      msg.say({
      text: "",
        attachments: [{
          text: `Enter an address, zip, or business name`,
          // callback_id: 'location_callback',
          color: 'good'
          }]
        })
        .route('get_address', { userEntered: text })
      })
    .route('get_address', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''
      if (!text) { //handles no response
        return msg
          .say("Whoops, I'm still waiting to hear where you are.")
          .route('get_address', state)
      }
      state.status = text
      msg
        .say(`Ok then. you are at ${text}`)
    // address => geolocation
  })
    // .route('color', (msg, state) => {
}

module.exports = {
  addressToGeo: addressToGeo
}

