const slapp = require('../../slackSetup.js').slapp

const yes = function(location,msg,state){
  msg.say({
  text: "",
    attachments: [{
      text: `Are you at ${location}?`,
      fallback: 'Where to today?',
      callback_id: 'yesno_callback',
      color: 'good',
      actions: 
      [{ 
        name: 'answer',
        text: 'Yes',
        type: 'button',
        value: 'yes'
      },{ 
        name: 'answer',
        text: 'no',
        type: 'button',
        value: 'no'
      }]
    }]
  })

  slapp.action('yesno_callback', 'answer', (msg, value) => {
    return (value=='yes' ? true : false)
  })
}

module.exports = {
  yes: yes
}