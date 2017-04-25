'use strict'

const express     = require('express')
const request     = require('request')

//firebase setup
const firebase    = require('./firebaseSetup.js')

// slapp setup
const slapp       = require('./slackSetup.js').slapp

//jaywalk slack commands
const slashCommands = require('./slashCommands/slashIndex.js')

/******************************
console.log testing area
*******************************/
// console.log(firebase.users)


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
