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
/*
radius function
*/
let radius = 500.0  // 0.5km or 2.2 mile total diameter
let numPoints = 6
function getRadius(lat, lng){
  let circlePoints = []
    for(let i=0;i< numPoints;i++){
      let angle = Math.PI * 2 * i / numPoints
      console.log(Math.PI)
      let dx = radius * Math.cos(angle)
      let dy = radius * Math.sin(angle)
      let point = {}
      point['lat'] = lat + (180 / Math.PI) * (dy / 6378137)
      point['lng'] = lng + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat * Math.PI / 180)
      circlePoints.push(point)
  }
  return circlePoints
}


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

let randomNum = (Math.floor(Math.random() * 1400)+200)

slapp.command('/jaywalk', (msg, text)=>{
  msg
  .say({
    text: '',
    attachments: [
      {
        text: 'Where do you want to Jaywalk to?',
        fallback: 'Where to today?',
        callback_id: 'doit_confirm_callback',
        actions: [
          { name: 'answer', text: 'Suprise Me!', type: 'button', value: randomNum },
          // { name: 'answer', text: 'Random Tag', type: 'button', value: Math.floor(Math.random() * 44) }
        ]
      }]
    })
  .route('getid', { id: text })
  })
  .route('getid', (msg, state) => {
    console.log(randomNum)
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
    if(randSnap !== ''){
      state.status = randSnap
      host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/1/rows?id="+randSnap+"&access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
    } else {
      state.status = randTag
      host = "https://api-cms-fitrock.kinetise.com/api/kinetise/v2/projects/199a5286a75bd6a4bddd37c6c62ee310/tables/5/rows/get-table?access_token=NGU1MzYxYTA1NGNlZDk2NjdlYzQ0OGU4N2Y3M2E5NTNhM2I2NTY0OThkODU5YjVmZDZjMjhmZjY1ZDI5OGFjZg"
    }

request(host, function(err,res,body){
    if (!err && res.statusCode == 200) {
    console.log(body);
  }
    body = JSON.parse(body)
    console.log(err)
    body=body[0]
    let lat = body.latitude
    let lng = body.longitude
    let radius = getRadius(lat,lng)
    console.log(lat,lng,radius)
    if(body.title !== undefined){
      msg.say(`I found a deal for you: ${body.title} ${body.description} ${body.picture} ${body.address} ${radius}`)
    } else {
      msg.say(`Hashtag: ${body.id} ${body.name}`)
    }
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
