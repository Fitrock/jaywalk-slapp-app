'use strict'
 
function appDl(teamInfo,msg,state){
  return msg.respond({  
    text: "",
    attachments: [{
      text: '<itms-apps://itunes.apple.com/us/app/jaywalk-walk-get-deals/id1171719157?mt=8|iPhone>',
      color: 'good'
    },{
      text: '<market://play.google.com/store/apps/details?id=com.kinetise.appb3e241f4c2ebeba41965ba16c05b2eba&hl=en_GB|Android>',
      color: 'good'
    }]
  })
}
  /*

function to determine if using destop or mobile
  */
  /*
 if mobile{ function to determine if using ios or android
  */
  

// !important find if there is a way to check if user owns app
// if mobile{button to send to correct app dl location or 
// if desktop{qr code & directions}

module.exports ={
	appDl: appDl
}