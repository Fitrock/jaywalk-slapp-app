'use strict'
const slapp  = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');

//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users

  

let notify  = function() {
  let randomNum = 0;
  slapp.command('/jaywalkNotify', (msg, text) => {
    let state = { requested: Date.now() }


    msg
      .say({
        text: '',
        attachments: [{
          text: 'What notifications do you want on this channel?',
          fallback: 'Set timed events.',
          callback_id: 'doit_confirm_callback',
          actions: [{
              name: 'answer',
              text: 'Coffee Spots',
              type: 'button',
              value: 'breakfast'
            },
            {
              name: 'answer',
              text: 'Lunch',
              type: 'button',
              value: 'lunch'
            },
            {
              name: 'answer',
              text: 'Dinner',
              type: 'button',
              value:  'dinner'
            },
            {
              name: 'answer',
              text: 'Happy Hour',
              type: 'button',
              value: 'hh'
            },
            {
              name: 'answer',
              text: 'Weekend fun',
              type: 'button',
              value:  'party'
            }            
          ]
        }]
      })
        .route('scheduler', state, 60) //expires after 60 sec       
  })
  .route('scheduler', (msg, state) => {
    let answer = msg.body.actions[0].value
    // user may not have typed text as their next action, ask again and re-route
    // if (!randSnap || !randTag) {
    //   return msg
    //     .say("Whoops, you just have to pick a button...")
    //     .say('Click a button!')
    //     .route('getid1', state)
    // }
    let radius
    if(answer == 'breakfast'){
      radius = getRadius(39.758451,-105.007625) //test: snap #1055
    }else if(answer == 'lunch'){
      radius = getRadius(40.018689, -105.279993) //test: snap #1055
    }else if(answer == 'dinner'){
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
       return msg.say("That doesn't work yet...")
    }else if(answer == 'hh'){
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
       return msg.say("That doesn't work yet...")
    }else if(answer == 'party'){
       // return open("itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8")
       return msg.say("That doesn't work yet...")
    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getDbinfo', state)
    }
    // let snapLat = snaps
    //   .orderByChild('lat')
    //   .startAt(radius[5].lat + "-") // "-"makes a string for query
    //   .endAt(radius[1].lat + "-")
    //   .once('value')
    //   .then(function(snap) {
    //     let body
    //     let count = 0
    //     snap.forEach(function(data) {
    //       //if returns lng within radius (east/west)
    //       if (data.val().lng <= radius[0].lng && data.val().lng >= radius[3].lng  && count <4) {
    //         // console.log(data.val().title)
    //         let body = data.val()
    //         let thisCount = count
    //         count ++
    //         let callback = function(picUrl){
    //           msg.say({
    //               text: 'Deal: '+ thisCount + '\n'+ body.description +'\n'+picUrl+'\n'+body.address
    //           }) //end msg.say
    //         }
    //         tinyurl.shorten(body.picture, function(res) {
    //           callback(res)
    //         })
    //       } //end if (lng checker)
    //     }) //end foreach
    //   }) //end .then
  })
}
module.exports = {
  notify: notify()
}


