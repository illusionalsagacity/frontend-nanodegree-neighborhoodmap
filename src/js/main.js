/* file: main.js */

(function($) {
    'use strict';

    var
    	flickrAPIKey = '6b24b2e754fe7ea499e2db41d1daa866',
    	foursquareClientID = '012MYNBUF2VK2SQK5C40HT0ZBX1255ZJGCG4XKYNTZ33DKE1',
    	foursquareClientSecret = 'ZLIFE0L5WIZ21LUARPYY3OFFWCUWUU3IVR42IEUUREGHBL3F';

    function api_flickrGetPhotoInfo(pid, photo) {
        var query = 'https://api.flickr.com/services/rest/';
        $.ajax({
            data: {
                method: 'flickr.photos.getInfo',
                api_key: flickrAPIKey,
                format: 'json',
                photo_id: pid
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            url: query,
            success: function(response) { // workaround to pass more than one parameter.
                setPhotoInfo(response, photo);
            }
        });
    }

    function setPhotoInfo(response, photo) {
        photo.realname(response.photo.owner.realname);
        photo.username(response.photo.owner.username);
        photo.description(response.photo.description._content);
        viewModel.photos.push(photo);
    }

    function createLocations(response) {
        $.each(response.response.groups[0].items, function(i, location) {
            var tmp = new Location(location.venue.name, location.tips[0].text, location.venue.location.lat, location.venue.location.lng, location.venue.rating);
            viewModel.locations.push(tmp);
        });
    }

    function api_foursquareExplore() {
    	$.ajax({
    		data: {
    			client_id: foursquareClientID,
    			client_secret: foursquareClientSecret,
    			ll: '37.8083,-122.4156',
    			v: '20150717'
    		},
    		dataType: 'jsonp',
    		url: 'https://api.foursquare.com/v2/venues/explore',
    		success: createLocations
    	});
    }

    function api_flickrSearch() {
        $.ajax({
            data: {
                method: 'flickr.photos.search',
                api_key: flickrAPIKey,
                safe_search: 1,
                content_type: 1,
                woe_id: 28288708,
                format: 'json',
                per_page: 20
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            url: 'https://api.flickr.com/services/rest/',
            success: createPhotos,
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    }

    function ViewModel() {
        this.appName = 'Neighborhood Map';
        this.latitude = 37.8083; // north
        this.longitude = -122.4156; // west
        this.searchTerm = ko.observable();
        this.photos = ko.observableArray([]);

        this.myLocations = ko.observableArray([]);

        this.locations = ko.observableArray([]);

        // google maps
        var latLng = new google.maps.LatLng(37.8083, -122.4156);
        var mapOptions = {
            center: latLng,
            draggable: true,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            panControl: false,
            zoom: 17,
            zoomControl: false,
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // TODO: finish.
        this.searchFor = function(formElement) {
            var text = $('#search', formElement).val();
            console.log(text);
            alert(text);
        };

        this.createMarkers = function() {
            this.locations().forEach(function(location) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.lat(), location.lng()),
                    map: map,
                    title: location.name()
                });
            });
        };
    }

    /* Location
     */
    function Location(name, desc, lat, lng, rating) {
        this.name = ko.observable(name);
        this.description = ko.observable(desc);
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.rating = ko.observable(rating);
    }

    /* Photo
     * A knockout-compatible class for flickr images.
     * fileext is a string like 'jpg' or 'png'.
     */
    function Photo(farm, server, id, secret, size, fileext, realname, username, description) {
        this.farm = ko.observable(farm);
        this.server = ko.observable(server);
        this.id = ko.observable(id);
        this.secret = ko.observable(secret);
        this.size = ko.observable(size);
        this.fileext = ko.observable(fileext);
        this.realname = ko.observable(realname);
        this.username = ko.observable(username);
        this.description = ko.observable(description);

        this.url = ko.computed(
            function() {
                return 'https://farm' + this.farm() + '.staticflickr.com/' + this.server() + '/' + this.id() + '_' + this.secret() + '_' + this.size() + '.' + this.fileext();
        }, this);
    }

    /* the success function for the flickr api. */
    function createPhotos(response) {
        $.each(response.photos.photo, function(i, photo) {
            var tmp = new Photo(photo.farm, photo.server, photo.id, photo.secret, 'b', 'jpg');
            api_flickrGetPhotoInfo(tmp.id(), tmp); // also puts the temporary photo into the viewmodel.
        });
    }

    var viewModel = new ViewModel();

    api_flickrSearch();
    api_foursquareExplore();

    ko.applyBindings(viewModel);
})(jQuery);