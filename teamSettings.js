/*
	used to setup/update company name, address, notifications...
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')

let teamSettings = function(teamInfo,msg,state){
// console.log(msg.type)
// console.log(msg.body.token)
// console.log(msg.body.message_ts)
// console.log(msg.body.channel.id)
  msg.respond({
  text: "",
    attachments: [{
      text: `Your current team is ${teamInfo.locationName}, located at ${teamInfo.address}.`,
      title: `Team settings`,
      callback_id: 'settings_callback',
      color: 'info',
      actions: 
      [{ 
        name: 'answer',
        text: `Set Company Name`,
        type: 'button',
        value: 'teamName'
      },{ 
        name: 'answer',
        text: `Set Company Location`,
        type: 'button',
        value: 'teamLocation'
      }]
    }]
  })
  slapp.action('settings_callback', 'answer',(msg,value) => {
  	msg.respond({
  		text:`${value}`
  		})
  })



}
module.exports = {
	teamSettings:teamSettings
}

