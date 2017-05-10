/*
	used to setup/update company name, address, notifications...
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')
let msgAttachments = require('./msgAttachments.js')
let notify = require('./slashCommands/notifySlash.js').notify

let teamDb = firebase.slackDb

let teamSettings = function(teamInfo,msg,state){
// console.log(msg.type)
// console.log(msg.body.token)
// console.log(msg.body.message_ts)
// console.log(msg.body.channel.id)
  msg.respond({
  	text: "",
    attachments: [{
    	pretext: `Click a button to change settings`,
      text: `Your team is located at ${teamInfo.address}.`,
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
      }]
    	},{
    	text:"",
    	callback_id:"back_callback",
    	actions:{ 
        name: 'answer',
        text: `<Back`,
        type: 'button',
        value: 'back'
      }
    }]
  })
  slapp.action('settings_callback', 'answer',(msg,value) => {
  	if(value=='notifications'){
      notify(teamInfo,msg,state)
  	}else if(value=='teamName'){
  		msg
  			.respond({
	  			text:"",
	  			attachments:[{
	  				text:"What would you like your business name to be?"		
	  			}]
	  		})
	  		.route('team_change',{text:text})


  		// teamDb.child(teamInfo.team_id).set(value)
  	}else if(value=='teamLocation'){
  		// teamDb.child(teamInfo.team_id).set(value)
  	}else{
			msg.respond({
  			text:`${value}`
  		})
  	}
  })
  slapp.action('back_callback', 'answer',(msg,value) => {
  	msgAttachments.jayBtns(teamInfo,msg,state)
  })
	.route('team_change', (msg,state)=>{
		var text = (msg.body.event && msg.body.event.text) || ''
		console.log(text)
	})



}
module.exports = {
	teamSettings:teamSettings
}

