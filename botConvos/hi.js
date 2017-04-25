'use strict'

const slapp  = require('../slackSetup.js').slapp

let hi = function(){
  // "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
  slapp
    .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
      msg
        .say(`${text}, how are you?`)
        // sends next event from user to this route, passing along state
        .route('how-are-you', { greeting: text })
    })
    .route('how-are-you', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("Whoops, I'm still waiting to hear how you're doing.")
          .say('How are you?')
          .route('how-are-you', state)
      }

      // add their response to state
      state.status = text

      msg
        .say(`Ok then. What's your favorite color?`)
        .route('color', state)
    })
    .route('color', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

      // user may not have typed text as their next action, ask again and re-route
      if (!text) {
        return msg
          .say("I'm eagerly awaiting to hear your favorite color.")
          .route('color', state)
      }

      // add their response to state
      state.color = text

      msg
        .say('Thanks for sharing.')
        .say(`Here's what you've told me so far: \`\`\`${JSON.stringify(state)}\`\`\``)
      // At this point, since we don't route anywhere, the "conversation" is over
    })

    // Can use a regex as well
  slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
    // You can provide a list of responses, and a random one will be chosen
    // You can also include slack emoji in your responses
    msg.say([
      "You're welcome :smile:",
      'You bet',
      ':+1: Of course',
      'Anytime :sun_with_face: :full_moon_with_face:'
    ])
  })


}

module.exports = {

  hi: hi()

}