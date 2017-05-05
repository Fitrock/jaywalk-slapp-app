const yesno = function(location){
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
    let res = ''
    (value=='yes' ? res='yes' : res="no")
    return res
  })
}

module.exports = {
  yesno: yesno()
}