/**
*@author: Judith Bresser, 459 956
*@version: 5.2,
*
*@desc Main Method
*@param  array_with_calculated_distances, array, which includes the values of the distance between two points
*@param array_with_calculated_bearing, array, which includes the values of the bearing for two points
*@param t1, temporary variable for 'for-loops', 0, because the index of a array starts there
*@param t2, temporary variable for 'for-loops', 0, because the index of a array starts there
*
*/
//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097
"use strict";
var point;
var pointcloud;

function main(point,pointcloud){

  if(typeof pointcloud==='string'){  pointcloud = JSON.parse(pointcloud);}
  if(typeof point==='string'){  point = JSON.parse(point);}

  var array_with_calculated_distances = [pointcloud.features.length];
  var array_with_calculated_bearing = [pointcloud.features.length];

  var length = pointcloud.features.length+1;
  var t1 = 0;
  var t2 = 0;


  /**
  *@desc 'For-loop' to get the values of the method 'distance' in array array_with_calculated_distances
  *
  */
  for( let i = 0; i< pointcloud.features.length;i++){
    if(length>=t1){
      array_with_calculated_distances[t1]= Math.round(distance(convert_GJSON_to_Array(point,0),convert_GJSON_to_Array(pointcloud,i)));
      t1++;
    }
  }

  /**
  *@desc 'For-loop' to get the values of the method 'bearing' in array array_with_calculated_bearing
  *
  */
  for( let i = 0; i< pointcloud.features.length;i++){
    if(length>=t2){
      array_with_calculated_bearing[t2]= bearing(convert_GJSON_to_Array(point,0),convert_GJSON_to_Array(pointcloud,i));
      t2++;
    }
  }


  /**
  *
  *@desc creates the array array_of_objects
  *creates objects to fill this array, objects consists of values of arrays array_with_calculated_distances and array_with_calculated_bearing
  *@param array_of_objects, array with objects, which includes point 1, point 2, distance between point 1 and point 2 and the bearing of point 1 to point 2
  *
  */

  var array_of_objects=[];
  var number_of_stops = pointcloud.features.length;
  for(let  i=0;i<number_of_stops;i++)
  {
    var pwb={

    };

    pwb.point=convert_GJSON_to_Array(point,0);
    pwb.pointcloud=pointcloud.features[i].properties.lbez+"  ("+pointcloud.features[i].properties.richtung+")";
    pwb.stopnumber=pointcloud.features[i].properties.nr;
    pwb.array_with_calculated_distances=array_with_calculated_distances[i];
    pwb.array_with_calculated_bearing=array_with_calculated_bearing[i];
    array_of_objects.push(pwb);
  }


  /**
  *
  *@desc runs the method 'sort' with the array array_of_objects to sort this array based on distance
  *@param array_of_objects, array with objects, which includes point 1, point 2, distance between point 1 and point 2 and the bearing of point 1 to point 2
  *
  */
  sort(array_of_objects);

  getXHRObject(array_of_objects[0].stopnumber);


  /**
  *
  *@desc runs the method 'mtable' with the array array_of_objects to create a dynamic table on the HTML site
  *@param array_of_objects, array with objects, which includes point 1, point 2, distance between point 1 and point 2 and the bearing of point 1 to point 2
  *
  */
  mtable(array_of_objects);
}


/**
*
*@@desc sort of array array_of_objects in ascending order based on the distance with 'bubble sort'
*@param array_of_objects, array with objects, which includes point 1, point 2, distance between point 1 and point 2 and the bearing of point 1 to point 2
*@return array_of_objects sorted based on distance
*/
function sort(array_of_objects){ //Insertion Sort

  var temp;
  for (var i = 1; i < array_of_objects.length; i++) {
    temp = array_of_objects[i];
    var j = i;
    while (j > 0 && array_of_objects[j - 1].array_with_calculated_distances > temp.array_with_calculated_distances) {
      array_of_objects[j]= array_of_objects[j - 1];
      j--;
    }
    array_of_objects[j] = temp;
  }
  return array_of_objects;
}


/**
*
*@desc Creates a table on the HTML Site
*@param array_of_objects, array with objects, which includes point 1, point 2, distance between point 1 and point 2 and the bearing of point 1 to point 2
*/
function mtable(array_of_objects){

  //Variablendeklaration
  var table = document.getElementById("Table");

  for (var i= 0; i<10;i++){

    var row = table.insertRow();  //insert a row

    row.insertCell().innerHTML=array_of_objects[i].point; //insert cell at the row variable with the point (point 1) value on place i of array array_of_objects
    row.insertCell().innerHTML=array_of_objects[i].pointcloud; //insert cell at the row variable with the pointcloud (point 2) value on place i of array array_of_objects
    row.insertCell().innerHTML=array_of_objects[i].array_with_calculated_distances; //insert cell at the row variable with the distance value on place i of array array_of_objects
    row.insertCell().innerHTML=array_of_objects[i].array_with_calculated_bearing; //insert cell at the row variable with the bearing value on place i of array array_of_objects
  }
}


/**
*
*@desc Returns the distance between p1 and p2
*@param  p1, first point
*@param p2 second point
*@return d(istance) as var
*Source:  https://www.movable-type.co.uk/scripts/latlong.html
*/
function distance(p1,p2){
  var R = 6374e3;
  var a1 = toRadial(p1[1]);
  var a2 = toRadial(p2[1]);
  var deltaKA = toRadial(p2[1]-p1[1]);
  var deltaphi = toRadial(p2[0]-p1[0]);

  var  a =  Math.sin(deltaKA/2)*Math.sin(deltaKA/2)+
  Math.cos(a1)*Math.cos(a2)*
  Math.sin(deltaphi/2)*Math.sin(deltaphi/2);

  var c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  var d = R*c;

  return d;
}

/**
*
*@desc Returns the direction in from P1 to P2
*@param  p1, first point
*@param p2 second point
*@return direction as string (N,NE,E,SE,S,SW,W,NW)
*Source:  https://www.movable-type.co.uk/scripts/latlong.html
*/

function bearing(p1,p2){

  var a1 = toRadial(p1[1]);

  var a2 = toRadial(p2[1]);
  var y= Math.sin(toRadial(p2[0]-p1[0]))*Math.cos(a2);
  var x = Math.cos(a1)*Math.sin(a2)-
  Math.sin(a1)*Math.cos(a2)*Math.cos(toRadial(p2[0]-p1[0]));
  var brng = todegree(Math.atan2(y,x));


  // If Clauses, to return the right strings

  if(brng>=0){  //brng is positive (N, NE, E, SE, S)

    if(brng<=22.5 && brng>=0){

      return "N";
    }
    if(brng<=67.5&&brng>=22.5){

      return "NE";
    }
    if(brng<=112.5&&brng>=67.5){

      return "E";
    }
    if(brng<=157.5&&brng>=112.5){

      return "SE";
    }
    if(brng<=180&&brng>=157.5){

      return "S";
    }

  }

  else { //brng is negative (N,NW,W,SW,S)

    if(brng>=0 && brng<=-22.5){

      return "N";
    }
    if(brng>=-67.5&brng<=-22.5){

      return "NW";
    }
    if((brng>=-112.5)&(brng<=-67.5)){

      return "W";
    }
    if(brng>=-157.5&brng<=-112.5){

      return "SW";
    }
    if(brng>=-180&&brng<=-157.5){

      return "S";
    }
  }
}


/**
*@desc calculates a value from degree to radians
*@param  a = passed variable
*@param pi = 3.14159265359
*@return a in radians with (a*(pi/180))
*/
function toRadial(a){
  var pi = 3.14159265359;
  return (a*(pi/180));
}


/**
*@desc calculates a value from  radians to degree
*@param  a = passed variable
*@param pi = 3.14159265359
*@return a in degree with (a*(180/pi))
*/

function todegree(a){
  var pi = 3.14159265359;
  return (a*(180/pi));

}


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 2////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//GETLOCATION

/**
*@desc return the user location via Callback function "showPosition"
*@param  t = temporary variable
*
*
*/
var t = document.getElementById("demo");
function getLocation() {

  console.log("getlocation");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    t.innerHTML = "Geolocation is not supported by this browser.";
  }
}


/**
*@desc callback function for "getLocatin" function
*@param  position = variable to save the position#
*@param actpos = array for main method with user position and pointcloud array
*
*
*/
function showPosition(position) {
  t.innerHTML = "User position: "+"<br>Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
  var actpos =[];
  actpos.push(position.coords.longitude);
  actpos.push(position.coords.latitude);
  actpos = convert_point_to_GJSON(actpos);
  CreatePointForUserPosition(actpos);
  document.getElementById("readpoint").value = JSON.stringify(actpos);
}


//GJSON
/**
*@desc convert Array of points in GJSON Feature
*@param  arrayofpoints = temporary variable
*@param featColl = Feature Collection of GeoJSON
*@param featObj = Feature Object of GeoJSON
*@return featColl with values and GeoJSON semantic
*
*/
function convert_arrayofpoints_toGJSON(arrayofpoints) {
  var featColl={ type:"FeatureCollection", features :[]};

  for(let  i=0;i<arrayofpoints.length;i++)
  {
    var FeatObj={
      type:"Feature",
      properties :[]
    };

    FeatObj.geometry={
      type :"Point",
      coordinates :arrayofpoints[i]

    };  featColl.features.push(FeatObj);

  }

  return featColl;
}


/**
*@desc convert point in GJSON Feature
*@param  point = temporary variable
*@param GJSONPoint = Feature Collection of GeoJSON
*@param featObj2 = Feature Object of GeoJSON
*@return GJSONPoint with values and GeoJSON semantic
*
*/
function convert_point_to_GJSON(point){
  var GJSONPoint={ type:"FeatureCollection", features :[]};
  var FeatObj2={
    type:"Feature",
    properties :[]
  };

  FeatObj2.geometry={
    type :"Point",
    coordinates :point

  };
  GJSONPoint.features.push(FeatObj2);

  return GJSONPoint;
}


/**
*@desc convert GJSON on index i to array
*@param  GJSON = GeoJSON Feature
*@param i = index of GeoJSON Feature Array
*@return Array of coordinates at index i of param GJSON
*
*/
function convert_GJSON_to_Array(GJSON, i){
  return GJSON.features[i].geometry.coordinates;
}

/**
*@desc return true, when test is an GeoJSON Object or false when test is not a GeoJSON Object
*@param  test = object
*
*@return true or false
*
*/

function isGJSON(test){
  if(test.features!=null)
  {return true;}
  else {
    return false;
  }

}


//InsertText
/**
*@desc convert a inserted text string to GJSON Point and run main methode with this value
*Uses Try-Catch to log an Error Screen, when  the input is not in GeoJSON semantic
*@param readpoint = inserted text string as GeoJSON Point
*
*/
function calculate_with_one_point(){

  var readpoint = document.getElementById("readpoint").value;

  try {
    var t = JSON.parse(readpoint);
    if(convert_GJSON_to_Array(t,0)!=null){
      main(t,pointcloud);
    }

  } catch (e) {
    window.alert("Insert GeoJSON only");
  }

  /**
  *@desc convert a inserted text strings to GJSON Point and GJSON Multipoint Feature and run main methode with this value
  *Uses Try-Catch to log an Error Screen, when  the input is not in GeoJSON semantic
  *@param readpoint = inserted text string as GeoJSON Point
  *@param readpointcloud = inserted text string as GeoJSON Multipoint
  *
  */
}
function calculate_with_one_point_and_pointcloud(){
  var readpoint = document.getElementById("readpoint").value;
  var readpointcloud = document.getElementById("readpointcloud").value;
  try {
    var point = JSON.parse(readpoint);
    var pointcloud = JSON.parse(readpointcloud);
    if((convert_GJSON_to_Array(pointcloud,1)!=null)&&(convert_GJSON_to_Array(point,0)!=null)){
      main(point,pointcloud);
    }

  } catch (e) {
    window.alert("Insert GeoJSON only");
  }
}

/**
*@desc running Main Method with origin point and pointcloud values
*@param point
*@param pointcloud
*
*/
function calculate_with_origin_point_and_pointcloud(){
  main(point,pointcloud);
}


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 3////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/**
*@desc get a XHR Object and turns this GJSON to the main method via callbackfunctions
*@param ID = Busstop ID, 0 for only busstops and not the arrival times of the lines
*@param ressource = link for the API
*
*/
function getXHRObject(ID){
  var Code = "haltestellen";
  var resource="";
  if (ID==0){   resource = "https://rest.busradar.conterra.de/prod/"+Code;}
  else{ resource = "https://rest.busradar.conterra.de/prod/"+Code+"/"+ID+"/abfahrten?sekunden=1200";}

  // console.log(resource);

  var x = new XMLHttpRequest();
  var y;
  x.onload = loadcallback;
  x.onerror = errorcallback;
  x.onreadystatechange = statechangecallback;
  x.open("GET",resource,true);
  x.send();


  /**
  *@desc callback function for the state of APIs query
  *@param x = API Object
  *
  */
  function statechangecallback(x) {

    console.dir(x);

    //console.log("statusvonx  "+this.status+" xreadystate  "+this.readyState);
    if (x.status == "200" && x.readyState == 4) {
      console.log("test1.2");
      console.log(x.responseText);
      document.getElementById("content").innerHTML = x.responseText +  JSON.stringify(JSON.parse(x.responseText),null,4);
    }
  }

  /**
  *@desc error function
  *
  */
  function errorcallback(e) {
    console.dir(x);
    console.dir(e);
    document.getElementById("content").innerHTML = "errorcallback: check web-console";
  }


  /**
  *@desc callback method to turn a GJSON Object with all busstops outside of the callback function
  *When  ID is not 0 goes another function further
  *@param x=API Object
  *@param jhaltestellen = GJSON Object with all busstops and their values
  *
  */
  function loadcallback() {
    console.dir(x);
    console.log(x.status);

    var u = JSON.parse(x.response);

    if(u.features!=null){

      var j = u.features.length;
      var jhaltestellen={ type:"FeatureCollection", features :[]};

      for(var i = 0; i<j;i++){

        jhaltestellen.features[i]=u.features[i];
      }

      jhaltestellen=JSON.stringify(jhaltestellen);

      showBusstops(jhaltestellen);
      calculate_busstops(jhaltestellen);
    }
    else {

      mtablestops(u);
    }
  }
}

/**
*@desc run main method with busstop object, and point from inserted text field or user location
*@param busstops
*
*/
function calculate_busstops(busstops){
  var readpoint = document.getElementById("readpoint").value;
  main(readpoint,busstops);
}

/**
*
*@desc Creates a table on the HTML Site
*@param array_of_objects, array with objects, which includes the lines and their departure and arrival times
*/
function mtablestops(array_of_objects){

  //Variablendeklaration
  var table = document.getElementById("Table2");

  console.log("table2");

  for (var i= 0; i<array_of_objects.length;i++){

    console.log("table2for");
    var row = table.insertRow();  //insert a row

    row.insertCell().innerHTML=array_of_objects[i].richtungstext; //insert cell at the row variable with the bearing of the line
    row.insertCell().innerHTML=array_of_objects[i].linienid; //insert cell at the row variable with with the lines number
    row.insertCell().innerHTML=convert_unixtime(array_of_objects[i].ankunftszeit); //insert cell at the row variable with the arrival time
    row.insertCell().innerHTML=convert_unixtime(array_of_objects[i].abfahrtszeit); //insert cell at the row variable with the planned departure time
    row.insertCell().innerHTML=convert_unixtime(array_of_objects[i].tatsaechliche_abfahrtszeit); //insert cell at the row variable with the right departure time
  }
}

/**
*
*@desc converts a unix time variable to 24h format and return this
*@param t = unix time variable
*@return converted unix time variable
*/

function convert_unixtime(t) {
  var dt = new Date(t*1000);
  var hr = dt.getHours();
  var m = "0" + dt.getMinutes();
  var s = "0" + dt.getSeconds();
  return hr+ ':' + m.substr(-2) + ':' + s.substr(-2);
}

///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 4////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

var L;
// A map is created and initialized.
var map = L.map('mapSection').setView([51.96, 7.63], 8);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: 'Leaflet, OpenStreetMap',
}).addTo(map);

/**
*
*@desc sets a marker of the user location on the map
*@param actpos = a GeoJSON with the user location
*/
function CreatePointForUserPosition(actpos){
  L.marker(changeCoordinates(convert_GJSON_to_Array(actpos,0))).addTo(map)
  .bindPopup("You are here!");
}

/**
*
*@desc shows the bus stops on the map  and the pop-ups contain information about the relevant bus stop
*@param jhaltestellen = a GEOJSON with all bus stops
*/
function showBusstops(jhaltestellen){
  //console.log("test"+jhaltestellen);
  if(typeof jhaltestellen==='string'){jhaltestellen = JSON.parse(jhaltestellen);}
  for(var i=0;i<jhaltestellen.features.length;i++){
    L.marker(changeCoordinates(convert_GJSON_to_Array(jhaltestellen,i))).addTo(map)
    .bindPopup("Name der Haltestelle: "+jhaltestellen.features[i].properties.lbez+" ("+jhaltestellen.features[i].properties.richtung+")"+"<br>"+" Kurzbezeichnung: "+jhaltestellen.features[i].properties.kbez);
  }
}

/**
*
*@desc Leaflet requires an array of coordinates where the x and y values are swapped. This function makes sure that this condition is met.
*@param array = an array with coordinates of the bus stops
*@return the array with reversed coordinates
*/
function changeCoordinates(array){
  var z = array[0];
  var q = array[1];
  array = [q,z];
  return array;
}


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 5////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

/**
 * @desc Funktion shows an simple alert.
 */
function showAlert(){
    alert("Button Clicked")
}

/**
 * @desc Shows Files stored in Database
 */
async function showFiles() {
    let query=""// query = ?name=geo
    let result = await getRequest(query);
    document.getElementById("text").innerHTML = JSON.stringify(result)
}

/**
 * @desc Request data stored in MongoDB and resolves them as promise
 * @param query to filter stored data
 */
function getRequest(query) {

    return new Promise(function (res, rej) {
        $.ajax({
            url: "/item " +query,
            success: function (result) { res(result) },
            error: function (err) { console.log(err) }
        });
    })
}

/**
 * ´@desc Send Files in textarea to Server to store them
 */
function sendFiles(){
    let input= document.getElementById("input").value;
    //proof valid json
    try{
        input = JSON.parse(input);
        postRequest(input)
    }
    catch (e){
        console.log(e);
        alert("No valid JSON");
    }

}

/**
 * @desc Sends data to server to get stored in database
 * @param dat to store
 */
function postRequest(dat) {

    console.log(dat)
    return new Promise(function (res, rej) {
        $.ajax({
            url: "/item",
            data: dat,
            type: "post",

            success: function (result) { res(result) },
            error: function (err) { console.log(err) }
        });
    })
}
