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

// slapp.event('link_shared', (msg) => {
//   let token = msg.meta.bot_token
//   let timestamp = msg.body.event.item.ts
//   let channel = msg.body.event.item.channel
//   slapp.client.reactions.add({token, name: 'smile', channel, timestamp}, (err) => {
//     if (err) console.log('Error adding reaction', err)
//   })
//   msg.say('link reaction works')
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
