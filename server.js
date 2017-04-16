'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const request  =require('request')

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`hi\` - to demonstrate a conversation that tracks state.
\`thanks\` - to demonstrate a simple response.
\`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
\`attachment\` - to see a Slack attachment message.
`

//*********************************************
// Setup different handlers for messages
//*********************************************

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

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

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
})

// '/' commands
slapp.command('/test', (msg)=>{
  msg.say('test works')
})



slapp.command('/getSnap', (msg, text)=>{
  msg
  .say({
    text: '',
    attachments: [
      {
        text: 'Where do you want to Jaywalk to?',
        fallback: 'Where to today?',
        callback_id: 'doit_confirm_callback',
        actions: [
          { name: 'answer', text: 'Suprise Me!', type: 'button', value: (Math.floor(Math.random() * 1400)+200) },
          { name: 'answer', text: 'Random Tag', type: 'button', value: Math.floor(Math.random() * 44) }
        ]
      }]
    })
  .route('getid1', { id: text })
  })
  .route('getid1', (msg, state) => {
    var randSnap = msg.body.actions[0].value || ''
    var randTag = msg.body.actions[0].value || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!randSnap || !randTag) {
      return msg
        .say("Whoops, you just have to pick a button...")
        .say('Click a button!')
        .route('getid1', state)
    }

    var host;
    if(randSnap){
      state.status = randSnap
      host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/1/rows?id="+text+"&access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
    } else {
      state.status = randTag
      host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/5/rows?id="+text+"&access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
    }

request(host, function(err,res,body){
    if (!err && res.statusCode == 200) {
    console.log(body);
  }
    body = JSON.parse(body)
    body=body[0]
    if(randSnap){
      msg.say(`I found a deal for you: `+body.title+ ' '+body.description+' '+body.picture+ ' '+ body.address)
    } else {
      msg.say(`Hashtag: `+body.id+ ' '+body.name)
    }
  })
})

slapp.command('/getSnaptest', (msg, text)=>{
  msg
    .say('type an id number')
    .route('getid', { id: text })
  })
  .route('getid', (msg, state) => {
    var text = msg.body.event.text || ''

    // user may not have typed text as their next action, ask again and re-route
    if (!text) {
      return msg
        .say("Whoops, I'm still waiting to hear and id.")
        .say('type an id number')
        .route('getid', state)
    }

    // add their response to state
    state.status = text
    var host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/1/rows?id="+text+"&access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
request(host, function(err,res,body){
    if (!err && res.statusCode == 200) {
    // console.log(body);
  }
  body = JSON.parse(body)
    console.log(typeof body)
body=body[0]
    console.log(typeof body)
    console.log(body)



    msg.say(`Here is the object you requested: `+body.title+ ' '+body.description+' '+body.picture+ ' '+ body.address)

  })
})


/*

*/



// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
