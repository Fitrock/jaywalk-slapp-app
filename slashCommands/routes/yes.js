const slapp = require('../../slackSetup.js').slapp


const yes = function(teamInfo,msg,state){
  const snapsByGeo = require('./snapsByGeoRoute.js').snapsByGeo

    let location = teamInfo.location_name

  msg.say({
  text: "",
    attachments: [{
      text: `Are you still at ${location}?`,
      fallback: 'Where to today?',
      callback_id: 'yesno_callback',
      color: 'good',
      actions: 
      [{ 
        name: 'answer',
        text: 'Yes',
        type: 'button',
        value: 'yes'
      },{ 
        name: 'answer',
        text: 'no',
        type: 'button',
        value: 'no'
      }]
    }]
  })
  slapp.action('yesno_callback', 'answer', (msg, value) => {
    let bool = (value=='yes' ? true : false)
    if(bool==true){
      snapsByGeo(teamInfo.lat,teamInfo.lng, msg, state)     
    }else{
      // msg.route('ask_address',state,60)
      msg.say('lets find where you are.... ')
    }
  })
}

module.exports = {
  yes: yes
}