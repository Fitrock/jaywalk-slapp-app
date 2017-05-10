const jayBtns={
  text: "",
  attachments: [{
    text: 'How can I help?',
    fallback: 'Where to today?',
    callback_id: 'jaywalk_callback',
    color: 'good',
    actions: [
      {
        name: 'answer',
        text: 'Find deals',
        type: 'button',
        value: 'address'
      },
      {
        name: 'answer',
        text: 'Notifications',
        type: 'button',
        value: 'notifications'
      },
      {
        name: 'answer',
        text: 'Settings',
        type: 'button',
        value: 'settings'
      },
      {
        name: 'answer',
        text: 'Download app',
        type: 'button',
        value: 'app'
      }      
    ]
  }]
}

module.exports = {
  jayBtns:jayBtns
}