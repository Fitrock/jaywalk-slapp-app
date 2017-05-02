const appDlRoute 		= require('./appDlRoute.js').appDl
const notifRoute	= require('./notifTimeRoute.js').notifTime
const hardcodedGeo	= require('./hardcodedGeoRoute.js').hardcodedLocation
const ipGeoRoute		= require('./ipGeoRoute.js').ipGeo
// const randomRoute		= require('./randomRoute.js')
const relaventRoute	= require('./relaventRoute.js').relaventAsk

module.exports = {
	appDl: appDlRoute,
	relaventAsk: relaventRoute,
	// notifTime: notifRoute,
	hardcodedGeo: hardcodedGeo,
	ipGeo: ipGeoRoute
	// randomRoute:randomRoute
}