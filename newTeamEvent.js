'use strict'
/*
	runs when "event": {"type": "bb.team_added"}
	asks to set company name and location
	stores teamInfo to firebase
*/

/*
msg.
body.
  token: '', // same as verify_token
  team_id: '',
  team_domain: '',
  channel_id: '',
  channel_name: '',
  user_id: '',
  user_name: ''
.meta: 
  { app_token: '',
    app_user_id: '',
    app_bot_id: '',
    bot_token: '',
    bot_user_id: '',
    bot_user_name: '',
    team_name: '',
    team_domain: '',
    team_resource_id: '',
    error: undefined,
    config: {} },
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')

const newTeam = function(){
	slapp.event('bb.team_added', (msg, text) => {


	})
}

module.exports = {
	newTeam: newTeam()
}