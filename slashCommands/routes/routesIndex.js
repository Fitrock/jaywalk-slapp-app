const appDlRoute 		= require('./appDlRoute.js').appDl
const notifRoute	= require('./notifTimeRoute.js').notifTime
const snapsByGeo	= require('./snapsByGeoRoute.js').snapsByGeo
const ipGeoRoute		= require('./ipGeoRoute.js').ipGeo
// const randomRoute		= require('./randomRoute.js')
const relaventRoute	= require('./relaventRoute.js').relaventAsk

module.exports = {
	appDl: appDlRoute,
	relaventAsk: relaventRoute,
	// notifTime: notifRoute,
	snapsByGeo: snapsByGeo,
	ipGeo: ipGeoRoute
	// randomRoute:randomRoute
}