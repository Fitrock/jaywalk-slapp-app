function relaventAsk (msg,state){
	msg.say({
		text: `Do you need to search again?`,
		attachments:[{
			color: 'good',
			callback_id: 'doit_confirm_callback',
			actions:[{
				name: 'answer',
	      text: 'Search by Location',
	      type: 'button',
	      value: 'location'
			},
			{
				name: 'answer',
	      text: 'Search by category',
	      type: 'button',
	      value: 'category'
	    },
	    {
				name: 'answer',
	      text: 'Get App',
	      type: 'button',
	      value: 'app'
	    }]
	  }]
	})
}
module.exports = {
	relaventAsk: relaventAsk
}