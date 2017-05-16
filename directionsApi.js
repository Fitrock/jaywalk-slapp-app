var request = require('request')

request(`https://maps.googleapis.com/maps/api/directions/json?origin=75+9th+Ave+New+York,+NY&destination=MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073&key=${process.env.MAP_KEY}`

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