Building out Slackbot and Slash commands for jaywalk.

Todo:
```
- Notifications 
	- √√subscribe button will add to db 
		- rebuild to add team lat/lng to notification db table
	- √√another cron func will send from db (AWS)
	- build notification callback to ask if they are interested in __ deals -> still at __? -> results
	- √√if(yes){results}
	- √√if(no){"Type your address, zip code, or current landmark"}
	- √√ display map directions for each snap
	- text directions for each snap
	- teamsettings to change db
## later
- adds walking weather to / command
- Voting Feature
- Determine if user is on desktop or mobile
	- if on desktop: determine if on browser or slack app
  - if mobile: do they have Jaywalk app?--might be able to store this info in db
  - have AWS call to firebase team info (linked with notifications) to make updated settings easier and reduce repeated stored data

- Integrate GeoSlack without extra webhooks
```