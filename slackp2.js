'use strict'

const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')



const firebase    = require('./firebaseSetup.js'),
      db = firebase.db,
      slack = db.ref("slack")
let botToken = '',
			verifyToken = '', 
			appToken = '';

function dbGet(req){
	slack
  .child(1)
  .once('value')
  .then(function(info) {
  	let data = info.val()
  	botToken = data.bot_token
  	verifyToken = data.SLACK_VERIFY_TOKEN
  	appToken = data.app_token
      // mixin necessary team meta-data
      console.log(appToken)
      slappData(botToken,verifyToken,appToken,req)
return req
	})

}
function slappData(bt,vt,at,req){
  return req.slapp.meta = Object.assign(req.slapp.meta, {
        app_token: at,
        bot_token: bt,
        verify_token: vt

        // bot_user_id: data.bot_user_id,
        // you can add your own team meta-data as well
        // other_value: data.other_value
      })
}

let slapp = Slapp({
					  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
					  	context (req, res, next) {
					  		console.log(req,res)
					  		dbGet(req)
					    let meta = req.slapp.meta

							  console.log(req.slapp)
					  },
					  convo_store: ConvoStore(),
					  log: true,
					  colors: true,

					})



// console.log(slapp)
module.exports = {
	slapp: slapp
}