var request = require('request')
require('dotenv').config()
start = `39.733543, -104.992554`
end=`39.733543, -104.91`


  // var latlng = new google.maps.LatLng(startd);
  // var myOptions = {
  //   zoom: 15,
  //   center: latlng,
  //   mapTypeControl: false,
  //   navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
  //   mapTypeId: google.maps.MapTypeId.ROADMAP
  // };
  // var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  // var marker = new google.maps.Marker({
  //     position: latlng,
  //     map: map,
  //     title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  // });

function getDirects(start,end){
	request(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`,function(error,success,body){
		// switch(succ){

		// }
		// console.log(success)
		var jsonB = JSON.parse(body)
		console.log(jsonB.routes[0].legs)
	})
}
getDirects(start,end)
function getMap(start,end){
	request(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&mode=walking&key=${process.env.MAP_KEY}`,function(error,success,body){
		// switch(succ){

		// }
		// console.log(success)
		var jsonB = JSON.parse(body)
		console.log(jsonB.routes[0].legs)
	})
}
getMap(start,end)
// var latlng = new google.maps.LatLng(39.733543, -104.992554);
// var myOptions = {
// 	zoom: 15,
// 	center: latlng,
// 	mapTypeControl: false,
// 	navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
// 	mapTypeId: google.maps.MapTypeId.ROADMAP
// };
// var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
// var marker = new google.maps.Marker({
// 	position: latlng,
// 	map: map,
// 	title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
// });
// console.log(map)







