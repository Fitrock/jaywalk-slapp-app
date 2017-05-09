Building out Slackbot and Slash commands for jaywalk.

Todo:
```
- Notifications 
	- √√subscribe button will add to db 
	- another cron func will send from db (heroku)
	- ask user to respond "lunch" => if (around lunch time){ask if still at base location}
	-if(yes){results}
	-if(no){"Type your address, zip code, or current landmark"}
- Voting Feature
## later
- Determine if user is on desktop or mobile
	- if on desktop: determine if on browser or slack app
  - if mobile: do they have Jaywalk app?--might be able to store this info in db

- Integrate GeoSlack without extra webhooks
```