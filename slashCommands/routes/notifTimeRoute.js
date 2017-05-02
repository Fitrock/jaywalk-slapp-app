const cron = require('cron')
const CronJob = cron.CronJob

let timeZone = 'America/Denver'
//moment?

let breakfast = new CronJob('00 00 07 * * 0-5', function() {
	// sun-fri 7:00am
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);

let lunch = new CronJob('00 30 11 * * 0-6', function() {
  // everyday 11:30am
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);


let dinner= new CronJob('00 30 17 * * 0-6', function() {
	// everyday 5:30pm
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);
let hh= new CronJob('00 30 16 * * 1-5', function() {
	// m-f 4:30pm
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);
let party= new CronJob('00 00 20 * * 4-6', function() {
 // thurs-sat at 8:00pm
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);
let test= new CronJob('* 42 12 * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
// console.log(breakfast)

function notifTimes(){

}
module.exports = {
	notifTimes: notifTimes
}


