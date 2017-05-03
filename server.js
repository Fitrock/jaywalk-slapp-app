'use strict'

const express     = require('express')
const request     = require('request')


/******************************
slack imports
*******************************/
const slapp       = require('./slackSetup.js').slapp
const slashCommands = require('./slashCommands/slashIndex.js')
const botConvos   = require('./botConvos/convoIndex.js')

//db imports


/******************************
console.log testing area
*******************************/
// console.log(firebase.users)

// const getRadius = require('./radius.js').getRadius
// let radius = getRadius(39.752764, -104.877743) //test: snap #1055
// console.log(radius)
console.log("webhook goes here hopefully",process.env.SLACK_INCOMING_WEBHOOK_URL)

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
