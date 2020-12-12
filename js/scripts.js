/* global MarkerWithLabel */
/* global google */
/* global $ */
/* global _ */
/**
 * scripts.js
 *
 * Computer Science 50
 * Problem Set 8
 *
 * Global JavaScript.
 */

// Google Map
var map;

// markers for map
var markers = [];
var potholes = [];

// info window
var info = new google.maps.InfoWindow();

// execute when the DOM is fully loaded
$(function() {

    // styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    var styles = [

        // hide Google's labels
        {
            featureType: "all",
            elementType: "labels",
            stylers: [
                {visibility: "off"}
            ]
        },

        // hide roads
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {visibility: "on"}
            ]
        }

    ];

    // options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var options = {
        // center: {lat: 37.4236, lng: -122.1619}, // Stanford, California
        center: {lat: 41.8200, lng: -71.4158}, // Providence, Rhode Island
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 14,
        panControl: true,
        styles: styles,
        zoom: 13,
        zoomControl: true
    };

    // get DOM node in which map will be instantiated
    var canvas = $("#map-canvas").get(0);

    // instantiate map
    map = new google.maps.Map(canvas, options);

    // configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);

});

/**
 * Adds marker for place to map.
 */
function addMarker(place)
{
    var content = '<ul>\n';
    var query = place.place_name + ',' + place.admin_name1 + ',' + place.postal_code;
    var parameters = {
        geo: query
    };
    $.getJSON("articles.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // return data to content
        for (var i = 0; i < data.length; i++)
        {
            content = content + '<li><a href="' + data[i].link + '" target="_blank">' + data[i].title + '</a></li>\n';
        }
        content = content + '</ul>';
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
    // Beach flag image from Google Maps custom icon tutorial
    // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    // Newspaper icon used by CS50 Staff in their Mashup implementation
    var image = 'https://maps.google.com/mapfiles/kml/pal2/icon31.png';
    var markLatLng = new google.maps.LatLng(parseFloat(place.latitude), parseFloat(place.longitude));
    var markLabel = place.place_name + ", " + place.admin_name1;
    var labelOffset = markLabel.length * 4;
    var marker = new MarkerWithLabel({
        position: markLatLng,
        draggable: false,
        map: map,
        icon: image,
        labelContent: markLabel,
        labelAnchor: new google.maps.Point(labelOffset, 0),
        labelClass: "label", // the CSS class for this label
        labelStyle: {opacity: 0.5}
    });
    google.maps.event.addListener(marker, "click", function()
    {
        // showInfo(marker, "The news from: " + markLabel + " " + place.postal_code);
        showInfo(marker, content);
    });
    
    markers.push(marker);
}

/**
 * Adds marker for place to map.
 */
function addPothole(place)
{
    // var content = '<ul>\n';
    // var query = place.place_name + ',' + place.admin_name1 + ',' + place.postal_code;
    // var parameters = {
    //     geo: query
    // };
    // $.getJSON("articles.php", parameters)
    // .done(function(data, textStatus, jqXHR) {

        // return data to content
    //     for (var i = 0; i < data.length; i++)
    //     {
    //         content = content + '<li><a href="' + data[i].link + '" target="_blank">' + data[i].title + '</a></li>\n';
    //     }
    //     content = content + '</ul>';
    // })
    // .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
    //     console.log(errorThrown.toString());
    // });
    // Beach flag image from Google Maps custom icon tutorial
    // var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    // Red Alert (found at https://sites.google.com/site/gmapsdevelopment/)
    // var image = 'https://maps.google.com/mapfiles/kml/pal3/icon33.png';
    // Small red target (found at https://sites.google.com/site/gmapsdevelopment/)
    var image = 'https://maps.google.com/mapfiles/kml/pal4/icon49.png';
    var markLatLng = new google.maps.LatLng(parseFloat(place.latitude), parseFloat(place.longitude));
    // var markLabel = place.street + ", " + place.city;
    var content = place.street + ", " + place.city;
    // var labelOffset = markLabel.length * 4;
    var pothole = new MarkerWithLabel({
        position: markLatLng,
        draggable: false,
        map: map,
        icon: image,
        // labelContent: markLabel,
        // labelAnchor: new google.maps.Point(labelOffset, 0),
        // labelClass: "label", // the CSS class for this label
        // labelStyle: {opacity: 0.5}
    });
    google.maps.event.addListener(pothole, "click", function()
    {
        // showInfo(marker, "The news from: " + markLabel + " " + place.postal_code);
        showInfo(pothole, content);
    });
    
    potholes.push(pothole);
}

/**
 * Configures application.
 */
function configure()
{
    // update UI after map has been dragged
    google.maps.event.addListener(map, "dragend", function() {
        update();
    });

    // update UI after zoom level changes
    google.maps.event.addListener(map, "zoom_changed", function() {
        update();
    });

    // remove markers whilst dragging
    google.maps.event.addListener(map, "dragstart", function() {
        removeMarkers();
        removePotholes();
    });

    // configure typeahead
    // https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
    $("#q").typeahead({
        autoselect: true,
        highlight: true,
        minLength: 1
    },
    {
        source: search,
        templates: {
            empty: "no places found yet",
            suggestion: _.template("<p><%- place_name %>, <%- admin_name1 %> <span><%- postal_code %></span></p>")
            // suggestion: _.template("<p>TODO</p>")
        }
    });

    // re-center map after place is selected from drop-down
    $("#q").on("typeahead:selected", function(eventObject, suggestion, name) {

        // ensure coordinates are numbers
        var latitude = (_.isNumber(suggestion.latitude)) ? suggestion.latitude : parseFloat(suggestion.latitude);
        var longitude = (_.isNumber(suggestion.longitude)) ? suggestion.longitude : parseFloat(suggestion.longitude);

        // set map's center
        map.setCenter({lat: latitude, lng: longitude});

        // update UI
        update();
    });

    // hide info window when text box has focus
    $("#q").focus(function(eventData) {
        hideInfo();
    });

    // re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
    // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
    document.addEventListener("contextmenu", function(event) {
        event.returnValue = true; 
        event.stopPropagation && event.stopPropagation(); 
        event.cancelBubble && event.cancelBubble();
    }, true);

    // update UI
    update();

    // give focus to text box
    $("#q").focus();
}

/**
 * Hides info window.
 */
function hideInfo()
{
    info.close();
}

/**
 * Removes markers from map.
 */
function removeMarkers()
{
    // TODO
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function removePotholes()
{
    // TODO
    for (var i = 0; i < potholes.length; i++) {
        potholes[i].setMap(null);
    }
}

/**
 * Searches database for typeahead's suggestions.
 */
function search(query, cb)
{
    // get places matching query (asynchronously)
    var parameters = {
        geo: query
    };
    $.getJSON("search.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // call typeahead's callback with search results (i.e., places)
        cb(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {

        // log error to browser's console
        console.log(errorThrown.toString());
    });
}

/**
 * Shows info window at marker with content.
 */
function showInfo(marker, content)
{
    // start div
    var div = "<div id='info'>";
    if (typeof(content) === "undefined")
    {
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='img/ajax-loader.gif'/>";
    }
    else
    {
        div += content;
    }

    // end div
    div += "</div>";

    // set info window's content
    info.setContent(div);

    // open info window (if not already open)
    info.open(map, marker);
}

/**
 * Updates UI's markers.
 */
function update() 
{
    // get map's bounds
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    // get places within bounds (asynchronously)
    var parameters = {
        ne: ne.lat() + "," + ne.lng(),
        q: $("#q").val(),
        sw: sw.lat() + "," + sw.lng()
    };
    $.getJSON("update.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removeMarkers();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addMarker(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
    $.getJSON("potholes.php", parameters)
    .done(function(data, textStatus, jqXHR) {

        // remove old markers from map
        removePotholes();

        // add new markers to map
        for (var i = 0; i < data.length; i++)
        {
            addPothole(data[i]);
        }
     })
     .fail(function(jqXHR, textStatus, errorThrown) {

         // log error to browser's console
         console.log(errorThrown.toString());
     });
}