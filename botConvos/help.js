'use strict'

const slapp  = require('../slackSetup.js').slapp


var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`hi\` - to demonstrate a conversation that tracks state.
\`thanks\` - to demonstrate a simple response.
\`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
\`attachment\` - to see a Slack attachment message.
`

let help = function(){
	// response to the user typing "help"
	slapp.message('help', ['mention', 'direct_message'], (msg) => {
	  msg.say(HELP_TEXT)
	})
}
module.exports = {
	help: help()
}