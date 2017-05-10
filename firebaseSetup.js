'use strict'

const express = require('express')
const firebase = require('firebase')
require('dotenv').config()
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

      
firebase.auth().signInWithEmailAndPassword(process.env.FIRE_EMAIL, process.env.FIRE_PASS).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
});



module.exports={
  db: db,
  snaps: snaps,
  tags: tags,
  users: users,
  slackDb: slackDb,
  notifications: notifications
}
