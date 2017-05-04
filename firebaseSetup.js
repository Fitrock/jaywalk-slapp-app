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
  SLACK_TOKEN: "", //given at auth
  INCOMING_WEBHOOK_URL: "", //given at auth
  CHANNEL_id: "",
  CHANNEL_name: "",
  notifications: [""],
  USERS: [
    {
      USER_id: "",
      USER_name: "c" //need to push additional user instead of editing this one
    }
  ]
}
let teamUsers = {
  team_id:""
  [
    {
      USER_id: "",
      USER_name: "" //need to push additional user instead of editing this one
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
