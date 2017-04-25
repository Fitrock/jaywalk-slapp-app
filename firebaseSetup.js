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
  let db    = firebase.database()

  let snaps = db.ref("snaps"),
      tags  = db.ref("tags"),
      users = db.ref("users")

module.exports={
  db: db,
  snaps: snaps,
  tags: tags,
  users: users
}
