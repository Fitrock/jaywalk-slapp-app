var request = require('request')
require('dotenv').config()
const where = require('node-where')


function getMap(start,end,msg,state){
	var googUrl = `https://maps.googleapis.com/maps/api/`


  // var address
  // //request to google to get route from user location to snap
  //   where.is(text,function(err,result){ 
    
  //     result.get('')=>
  //     address,streetNumber, street,streetAddress,city,region,
  //     regionCode, postalCode, country, countryCode, lat, lng
    
  //   if (result) {
  //     address = result.get('address')
  //     let lng = result.get('lng')
  //     snapsByGeo(lat,lng,msg,state)
  //   }
  // })


  console.log(`${googUrl}directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`)
	request(`${googUrl}directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`,function(error,success,body){
		body = console.log(JSON.parse(body))
    let route = body.routes[0]
    console.log(route)

    //routeLine is the directions line to overlay on
    let routeLine =route.overview_polyline.points

    // adds directions to a static map
		let mapUrl =`${googUrl}staticmap?size=600x400&origin=${start}&destination=${end}&path=enc%3A${routeLine}&key=${process.env.DIRECTIONS_KEY}`
		// console.log('directionsapi:',mapUrl)
		 msg.respond({
      text: '',
      "attachments": [
        {
          "title": `tags or description?`,
          "text":`address`,
          "color": "good",
          // "title_link": "https://www.google.com/maps/place/" + start,
          "image_url": `${mapUrl}`,
          //"thumb_url": "http://example.com/path/to/thumb.png"
           "fields":[
            {
               "title": "tags or description?",
               "value": `directions`,//foreach on turn by turn directions?
               "short": true
            }
           ]
        }
      ]
    
  })
	})
}

module.exports={
	getMap:getMap
}


// {
//   origin: LatLng | String | google.maps.Place,
//   destination: LatLng | String | google.maps.Place,
//   travelMode: TravelMode,
//   transitOptions: TransitOptions,
//   drivingOptions: DrivingOptions,
//   unitSystem: UnitSystem,
//   waypoints[]: DirectionsWaypoint,
//   optimizeWaypoints: Boolean,
//   provideRouteAlternatives: Boolean,
//   avoidHighways: Boolean,
//   avoidTolls: Boolean,
//   region: String
// }







