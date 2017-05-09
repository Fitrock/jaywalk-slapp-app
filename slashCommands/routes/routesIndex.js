const appDlRoute 		= require('./appDlRoute.js').appDl
// const notifRoute	= require('./notifTimeRoute.js').notifTime
const snapsByGeo	= require('./snapsByGeoRoute.js').snapsByGeo
// const randomRoute		= require('./randomRoute.js')
const relaventRoute	= require('./relaventRoute.js').relaventAsk
const addressToGeo	= require('./addressToGeo.js').addressToGeo

module.exports = {
	appDl: appDlRoute,
	relaventAsk: relaventRoute,
	// notifTime: notifRoute,
	snapsByGeo: snapsByGeo,
	addressToGeo: addressToGeo 
	// randomRoute:randomRoute
}