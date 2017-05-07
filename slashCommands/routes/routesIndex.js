const appDlRoute 		= require('./appDlRoute.js').appDl
const notifRoute	= require('./notifTimeRoute.js').notifTime
const snapsByGeo	= require('./snapsByGeoRoute.js').snapsByGeo
const ipGeoRoute		= require('./ipGeoRoute.js').ipGeo
// const randomRoute		= require('./randomRoute.js')
const relaventRoute	= require('./relaventRoute.js').relaventAsk
const addressToGeo	= require('./addressToGeo.js').addressToGeo

module.exports = {
	appDl: appDlRoute,
	relaventAsk: relaventRoute,
	// notifTime: notifRoute,
	snapsByGeo: snapsByGeo,
	ipGeo: ipGeoRoute
	addressToGeo:addressToGeo 
	// randomRoute:randomRoute
}