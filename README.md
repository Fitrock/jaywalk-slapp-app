Building out Slackbot and Slash commands for jaywalk.

Todo:
```
- Notifications 
  - ! have AWS call to firebase team info (linked with notifications) to make updated settings easier and reduce repeated stored data

	- build notification callback to ask if they are interested in __ deals -> still at __? -> results

	- text directions for each snap
	- teamsettings to change db
	- AWS error notifications for each cron(might be why they are not sending)
	- setting multiple at the same time notifications and give feedback when successful
	- back button!
	
```



```
## later
- AWS notifications based on time zone instead of Denver only
- adds walking weather to / command
- Voting Feature
- Determine if user is on desktop or mobile
	- if on desktop: determine if on browser or slack app
  - if mobile: do they have Jaywalk app?--might be able to store this info in db

- Integrate GeoSlack without extra webhooks
```

```
### done
	- √√ subscribe button will add to db 
		-√√ rebuild to add team lat/lng to notification db table
	- √√ another cron func will send from db (AWS)
	- √√ if(yes){results}
	- √√ if(no){"Type your address, zip code, or current landmark"}
	- √√ display map directions for each snap

```