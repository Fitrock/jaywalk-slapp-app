/*
	used to setup/update company name, address, notifications...
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')

const jaywalk = require('./slashCommands/jaywalkSlash.js')

let teamSettings = function(teamInfo,msg,state){
// console.log(msg.type)
// console.log(msg.body.token)
// console.log(msg.body.message_ts)
// console.log(msg.body.channel.id)
  		console.log(jaywalk.jayBtns)

  msg.respond({
  text: "",
    attachments: [{
    	pretext: `Click a button to change settings`,
      text: `Your current team is located at ${teamInfo.address}.`,
      title: `Team settings for ${teamInfo.location_name}.`,
      callback_id: 'settings_callback',
      color: 'info',
      actions: 
      [{ 
        name: 'answer',
        text: `New Name`,
        type: 'button',
        value: 'teamName'
      },{ 
        name: 'answer',
        text: `New Location`,
        type: 'button',
        value: 'teamLocation'
      },{ 
        name: 'answer',
        text: `Notifications`,
        type: 'button',
        value: 'notifications'
      },{ 
        name: 'answer',
        text: `<Back`,
        type: 'button',
        value: 'back'
      }
      ]
    }]
  })
  slapp.action('settings_callback', 'answer',(msg,value) => {
  	if(value=='back'){
  		msg
  			.respond(jaywalk.jayBtns)
  		  .route('requestToDatabase', state, 60)    

  	}else{
			msg.respond({
  			text:`${value}`
  		})
  	}
  })



}
module.exports = {
	teamSettings:teamSettings
}

