/*
    filename: app.js
*/

var ViewModel = require('./viewmodel.js');
var Photo = require('./photo.js');
var Location = require('./location.js');
var Error = require('./error.js');
var Offline = require('./offline.js');
var FlickrAPI = require('./flickr.js');
var FoursquareAPI = require('./foursquare.js');

var
    flickrAPIKey = '6b24b2e754fe7ea499e2db41d1daa866',
    flickrAPIUrl = 'https://api.flickr.com/services/rest',
    foursquareClientID = '012MYNBUF2VK2SQK5C40HT0ZBX1255ZJGCG4XKYNTZ33DKE1',
    foursquareClientSecret = 'ZLIFE0L5WIZ21LUARPYY3OFFWCUWUU3IVR42IEUUREGHBL3F';

var flickrAPI = new FlickrAPI(flickrAPIKey, flickrAPIUrl);
var foursquareAPI = new FoursquareAPI(foursquareClientID, foursquareClientSecret);

function createLocations(response) {
    $.each(response.response.groups[0].items, function(i, location) {
        var address = location.venue.location.address + ', ' +
            location.venue.location.city + ', ' +
            location.venue.location.state + ' ' +
            location.venue.location.postalCode + ', ' +
            location.venue.location.country;

        var categories = [];
        location.venue.categories.forEach(function(category) {
            categories.push(category.name);
        });

        var iconUrl;
        if (typeof location.venue.categories !== "undefined") {
            iconUrl = location.venue.categories[0].icon.prefix + 'bg_32' + location.venue.categories[0].icon.suffix;
        } else {
            iconUrl = '';
        }

        var tmp = new Location(
            location.venue.name,
            address,
            location.tips[0].text,
            location.venue.location.lat,
            location.venue.location.lng,
            location.venue.rating,
            location.venue.ratingColor,
            categories,
            iconUrl
        );
        viewModel.locations.push(tmp);
    });
}

var viewModel = new ViewModel();

$(document).ready(function() {
    'use strict';

    flickrAPI.photosSearch(28288708)
    .done(function(data, textStatus, jqXHR) {
        $.each(data.photos.photo, function(i, photo) {
            var tmp = new Photo(photo.farm, photo.server, photo.id, photo.secret, 'b', 'jpg');

            flickrAPI.photosGetInfo(tmp.id())
            .done(function(data, textStatus, jqXHR) {
                tmp.setInfo(data);
                viewModel.photos.push(tmp);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                viewModel.errors.push(new Error(
                    'Flickr API Error',
                    'Could not retrieve Flickr search data.'
                    )
                );
            });
        });
        viewModel.photos.valueHasMutated();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        viewModel.errors.push(new Error(
            'Flickr API Error',
            'Could not retrieve Flickr search data.'
            )
        );
    });

    foursquareAPI.explore('37.8083,-122.4156', '20150717')
    .done(function(data, textStatus, jqXHR) {
        createLocations(data);
        viewModel.createMarkers();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        viewModel.errors.push(new Error(
            'Foursquare API Error',
            'Could not retrieve Foursquare data.'
            )
        );
    });

    ko.applyBindings(viewModel);
});