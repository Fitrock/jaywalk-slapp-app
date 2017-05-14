/*
	used to setup/update company name, address, notifications...
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')
let msgAttachments = require('./msgAttachments.js')
let notify = require('./slashCommands/notifySlash.js').notify
const where = require('node-where')

let teamDb = firebase.slackDb

let teamSettings = function(teamInfo,msg,state){
// console.log(msg.type)
// console.log(msg.body.token)
// console.log(msg.body.message_ts)
// console.log(msg.body.channel.id)
state.teamInfo=teamInfo
  msg.respond({
  	text: "",
    attachments: [{
    	pretext: `Click a button to change settings`,
      text: `Your team is located at ${teamInfo.address}.`,
      title: `Team settings for ${teamInfo.team_name}.`,
      callback_id: 'settings_callback',
      color: '#6b7f98',
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
    	color:"",
    	actions:{ 
        name: 'answer',
        text: `<Back`,
        type: 'button',
        value: 'back'
      }
    }]
  })
  slapp.action('settings_callback', 'answer',(msg,value) => {
  	state.value=value
  	if(value=='notifications'){
      notify(teamInfo,msg,state)
  	}else if(value=='teamName'){
  		msg.respond({
	  			text:"",
	  			attachments:[{
	  				text:"What would you like your business name to be?"		
	  			}]
	  		})
	  		.route('name_change',state,30)
  	}else if(value=='teamLocation'){
  		msg.respond({
	  			text:"",
	  			attachments:[{
	  				text:"What is your business address?"		
	  			}]
	  		})
	  		.route('location_change',state,30)
  	}else{
			msg.respond({
  			text:`${value}`
  		})
  	}
  })
  slapp.action('back_callback', 'answer',(msg,value) => {
  	msgAttachments.jayBtns(teamInfo,msg,state)
  })
	.route('name_change', (msg,state)=>{
		var text = (msg.body.event && msg.body.event.text) || ''
		
			teamDb.child(state.teamInfo.team_id).update({team_name:text})
			back_callback()
	
	})
	.route('location_change', (msg,state)=>{
		var text = (msg.body.event && msg.body.event.text) || ''
		  if (result) {
        let lat = result.get('lat')
        let lng = result.get('lng')
      // slackDb.child(msg.body.team_id).set(teamObj)
  //           oldTeamCallback(msg,state)
	  		teamDb.child(state.teamInfo.team_id).update({lat:lat,lng:lng})
	  		back_callback()
      }
	})


}
module.exports = {
	teamSettings:teamSettings
}

