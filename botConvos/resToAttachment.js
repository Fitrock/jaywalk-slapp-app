'use strict'

const slapp  = require('../slackSetup.js').slapp

let attachment = function(){
  // demonstrate returning an attachment...
  slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
    msg.say({
      text: 'Check out this amazing attachment! :confetti_ball: ',
      attachments: [{
        text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
        title: 'Slapp Library - Open Source',
        image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
        title_link: 'https://beepboophq.com/',
        color: '#7CD197'
      }]
    })
  })
}
module.exports = {
  attachment: attachment()
}