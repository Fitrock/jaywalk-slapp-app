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
      slackDb = db.ref("slack"),
      notifications = db.ref("notifications")
// setup for production (sign in to edit)
//http://stackoverflow.com/questions/37403747/firebase-permission-denied

let teamObj = {
  team_id: "",
  team_name: "",
  location:"",
  location_name:"",
  address:"",
  lat:"",
  lng:"",
  slack_token: "", //given at auth
  bot_token: "",
  webhook: "", //given at auth
  channel_id: "",
  channel_name: "",
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

let coffee = {
  team_id:"T24TZGPAN", //access team_id db object for stored location
  incoming_webhook:"123" //url to send info to slack
}
let lunch = {
  team_id:"T24TZGPAN",
  incoming_webhook:""
}
let hh = {
  team_id:"T24TZGPAN",
  incoming_webhook:""
}
let dinner = {
  team_id:"",
  incoming_webhook:""
}
let bars = {
  team_id:"",
  incoming_webhook:""
}
console.log(process.env.fire_email)

// firebase.auth().signInWithEmailAndPassword(process.env.fire_email, process.env.fire_pass).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
// });
// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     // var thisUser = firebase.auth().currentUser;
//     /*
//       db request goes here
//     */

//   } else {
//     // No user is signed in.
//     console.log('not signed in', user)
//   }
// });

// db.ref("notifications").child('coffee').child(coffee.team_id).set(coffee)
// db.ref("notifications").child('lunch').child(lunch.team_id).set(lunch)
// db.ref("notifications").child('dinner').child(coffee.team_id).set(dinner)
// db.ref("notifications").child('hh').child(coffee.team_id).set(hh)
// db.ref("notifications").child('bars').child(coffee.team_id).set(bars)
// slackDb.child(teamObj.team_id).set(teamObj)

module.exports={
  db: db,
  snaps: snaps,
  tags: tags,
  users: users,
  slackDb: slackDb,
  notifications: notifications
}
