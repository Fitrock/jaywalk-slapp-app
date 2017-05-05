'use strict'
const slapp  = require('../slackSetup.js').slapp
const getRadius = require('../radius.js').getRadius
const tinyurl = require('tinyurl');

const snapsByGeo = require('./routes/snapsByGeoRoute.js').snapsByGeo


//db imports
const firebase    = require('../firebaseSetup.js'),
      db = firebase.db,
      snaps = firebase.snaps,
      tags = firebase.tags,
      users = firebase.users,
      slackDb = firebase.slackDb



let jaywalk  = function() {
  let randomNum = 0;
  slapp.command('/jaywalk', (msg, text) => {
    /*

      call to db to get team info from team_id

    */

    let state = { requested: Date.now() }
    msg
      .say({
        text: '',
        attachments: [{
          text: 'Where do you want to Jaywalk to?',
          fallback: 'Where to today?',
          callback_id: 'doit_confirm_callback',
          color: 'good',
          actions: [{
              name: 'answer',
              text: 'Boomtown',
              type: 'button',
              value: 'boomtown'
            },
            {
              name: 'answer',
              text: 'WeWork',
              type: 'button',
              value: 'wework'
            },
            {
              name: 'answer',
              text: 'Suprise Me',
              type: 'button',
              value: 'suprise'
            },
            {
              name: 'answer',
              text: 'Download App',
              type: 'button',
              value:  'app'

            },
            {
              name: 'answer',
              text: 'Setup',
              type: 'button',
              value: 'setup'
            }
          ]
        }]
      })
        .route('getDbinfo', state, 60) //expires after 60 sec       
  })
  .route('getDbinfo', (msg, state) => {
    let answer = msg.body.actions[0].value
    let radius
    if(answer == 'boomtown'){

      hardcodedLocation(39.758451,-105.007625, msg, state) //(lat,lng) of boomtown
    }else if(answer == 'wework'){
      hardcodedLocation(40.018689, -105.279993, msg, state) //test: snap #1055
    }else if(answer == 'app'){
      return msg.say({  
        text: "",      
        attachments: [{
          text: '<itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8|iPhone>',
          callback_id: 'doit_confirm_callback',
          thumb_url: 'https://goo.gl/images/famYEL',
          color: 'good'
        },{
          text: '<market://play.google.com/store/apps/details?id=com.kinetise.appb3e241f4c2ebeba41965ba16c05b2eba&hl=en_GB|Android>',
          callback_id: 'doit_confirm_callback',
          color: 'good'
        }]
      })
    }else{ //handle error
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getDbinfo', state)
    }
    let snapLat = snaps
      .orderByChild('lat')
      .startAt(radius[5].lat + "-") // "-"makes a string for query
      .endAt(radius[1].lat + "-")
      .once('value')
      .then(function(snap) {
        let body
        let count = 0
        snap.forEach(function(data) {
          //if returns lng within radius (east/west)
          if (data.val().lng <= radius[0].lng && data.val().lng >= radius[3].lng  && count <4) {
            // console.log(data.val().title)
            let body = data.val()
            let thisCount = count
            count ++
            let callback = function(picUrl){
              msg.say({
                  text: '',
                  attachments:[{
                    title: `${body.description}`,
                    title_link: `https://s.walkto.co/pin/${body.snap_id}`,
                    color: 'warning',
                    image_url: `${picUrl}`,
                    thumb_url: `${picUrl}`,
                    text: `${body.address} ${body.snap_id}`,
                    footer:`Jaywalk: ${thisCount}`
                  }]
              }) //end msg.say
            }
            tinyurl.shorten(body.picture, function(res) {
              callback(res)
            })
          } //end if (lng checker)
        }) //end foreach
      }) //end .then
  })
}
module.exports = {
  jaywalk: jaywalk()
}


