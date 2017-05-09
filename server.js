'use strict'

const express     = require('express')
const request     = require('request')


/******************************
slack imports
*******************************/
const slapp       = require('./slackSetup.js').slapp
const index 			= require('./slashCommands/index.js')
const botConvos   = require('./botConvos/convoIndex.js')

/******************************
firebase imports
*******************************/
// const firebase    = require('./firebaseSetup.js'),
//       slackDb = firebase.slackDb

/******************************
console.log testing area
*******************************/
// console.log(firebase.users)
// request('http://dev.jaywalk.me/api/spots/?lat=52.00000000000000000/?lng=-40.00000000000000000',function(err,res,body){
// console.log(res.statusCode)
// console.log(body)
// })


// attach Slapp to express server
const server = slapp.attachToExpress(express())
const port = process.env.PORT || 3000
// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
