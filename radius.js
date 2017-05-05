/*
radius function
*/
let radius = 60200.0  // 3.2km or 4 mile total diameter
let numPoints = 6
function getRadius(lat, lng){
  let circlePoints = []
    for(let i=0;i< numPoints;i++){
      let angle = Math.PI * 2 * i / numPoints
      let dx = radius * Math.cos(angle)
      let dy = radius * Math.sin(angle)
      let point = []
      point['lat'] = lat + (180 / Math.PI) * (dy / 6378137)
      point['lng'] = lng + (180 / Math.PI) * (dx / 6378137) / Math.cos(lat * Math.PI / 180)
      circlePoints.push(point)
  }
  return circlePoints
}
// 0-5 points: starts 
module.exports = {
  getRadius: getRadius
}