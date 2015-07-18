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
            success: function(response) {
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
    		success: function(response) {
    			console.log(response.response.groups[0].items);
    		}
    	})
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
        this.locations = ko.observableArray([
            {
                name: 'Harry\'s Diner',
                description: 'A small diner!',
                address: '',
                lat: 37.8083,
                lng: -122.4157,
            },
        ]);

        // TODO: finish.
        this.searchFor = function(formElement) {
            var text = $('#search', formElement).val();
            console.log(text);
            alert(text);
        };
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

    /* initialize()
     * Contains the settings for the google maps api, executed on window load.
     */
    function initialize() {
        var latLng = new google.maps.LatLng(37.8083, -122.4156);
        var mapOptions = {
            center: latLng,
            draggable: false,
            disableDefaultUI: true,
            disableDoubleClickZoom: true,
            scrollwheel: false,
            panControl: false,
            zoom: 17,
            zoomControl: false,
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

    var viewModel = new ViewModel();
    ko.applyBindings(viewModel);

    api_flickrSearch();
    api_foursquareExplore();
})(jQuery);