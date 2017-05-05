'use strict'

const express = require('express')
const firebase = require('firebase')

/*
Firebase
*/
var config = {
  apiKey: "AIzaSyD5JZLxrwPRWO5Wq02GMo7V4Yxsc_pQsO8",
  authDomain: "jaywalk-8a738.firebaseapp.com",
  databaseURL: "https://jaywalk-8a738.firebaseio.com",
  projectId: "jaywalk-8a738",
  storageBucket: "jaywalk-8a738.appspot.com",
  messagingSenderId: "1042841275273"
};
  firebase.initializeApp(config);
  let db      = firebase.database()

  let snaps   = db.ref("snaps"),
      tags    = db.ref("tags"),
      users   = db.ref("users"),
      slackDb = db.ref("slack")
// setup for production (sign in to edit)
//http://stackoverflow.com/questions/37403747/firebase-permission-denied

let teamObj = {
  team_id: "",
  team_name: "",
  slack_token: "", //given at auth
  incoming_webhook: "", //given at auth
  channel_id: "",
  channel_name: "",
  notifications: [""],
  users: [
    {
      user_id: "",
      user_name: "" //need to push additional user instead of editing this one
    }
  ]
}
let teamUsers = {
  team_id:"",
  users:[
    {
      user_id: "",
      user_name: "", //need to push additional user instead of editing this one
      has_app: false // based on "sign up with slack" login button on jaywalk app
    }
  ]
}
/*  The notifications object will push team_id and their webhook 
    for each notification they subscribe to. 
    The keys for notifications are each an array of teams subscribed

    This will eventually be used in another server that just runs cron
    functions to access db at notification times and goes through array
    foreach will send a prompt to slack channel.
*/
let notifications = {
  coffee:[
    {
    team_id:"", //access team_id db object for stored location
    incoming_webhook:"" //url to send info to slack
    }
  ],
  lunch:[
    {
    team_id:"",
    incoming_webhook:""
    }
  ],
  happy_hour:[
    {
    team_id:"",
    incoming_webhook:""
    }
  ],
  dinner:[
    {
    team_id:"",
    incoming_webhook:""
    }
  ],
  bars:[
    {
    team_id:"",
    incoming_webhook:""
    }
  ]
}



// slackDb.child(teamObj.team_id).set(teamObj)

module.exports={
  db: db,
  snaps: snaps,
  tags: tags,
  users: users,
  slackDb: slackDb
}
