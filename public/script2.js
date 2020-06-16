/**
*@author: Judith Bresser, 459 956
*@version: 5.2,
*
* References: https://github.com/streuselcake/jslab
*/
//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097
"use strict";


///////////////////////////////////////////////////////////////////////////////////
////////////////////////////////ÜBUNG 4////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


var L;
const lat = 51.96;
const lon = 7.59;
const start_latlng = [lat, lon];

// A map is created and initialized.
var map = L.map("mapdiv").setView(start_latlng, 13);

// A tile layer is added to the map.
var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
  id: "osm"
}).addTo(map);

var drawnItems = L.featureGroup().addTo(map);

// The layer control adds check boxes. This allows layers to be loaded or hidden.
L.control.layers({
  'osm': osm.addTo(map),
  "google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
  })
}, { 'drawlayer': drawnItems }, { position: 'topleft', collapsed: false }).addTo(map);

map.addControl(new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    poly: {
      allowIntersection: false
    }
  },

  draw: {
    circle: true,
    marker: true,
    polygon: {
      allowIntersection: false,
      showArea: true
    }
  }
}));

// TODO update on any change, currently various events (e.g. delete) miss to trigger the textarea
map.on(L.Draw.Event.CREATED, function (event) {
  // map.on("draw:created", function (event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);

  updateText();
});

map.on("draw:edited", function (event) {
  updateText();
});

/**
* creates a geojson text representation from the the drawnItems with a FeatureCollection as root element
*/
function updateText(){

  // to convert L.featureGroup to GeoJSON FeatureCollection
  // note: https://gis.stackexchange.com/questions/54065/leaflet-geojson-coordinate-problem/246104
  //
  document.getElementById("geojsontextarea").value = JSON.stringify(drawnItems.toGeoJSON());

}
