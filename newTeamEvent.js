/*
	runs when "event": {"type": "bb.team_added"}
	asks to set company name and location
	stores teamInfo to firebase
*/
const slapp       = require('./slackSetup.js').slapp
const firebase    = require('./firebaseSetup.js')