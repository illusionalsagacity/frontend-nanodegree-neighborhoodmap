/* file: main.js */

jQuery(function($) {
    'use strict';

    var
        flickrAPIKey = '6b24b2e754fe7ea499e2db41d1daa866',
        flickrAPIUrl = 'https://api.flickr.com/services/rest',
        foursquareClientID = '012MYNBUF2VK2SQK5C40HT0ZBX1255ZJGCG4XKYNTZ33DKE1',
        foursquareClientSecret = 'ZLIFE0L5WIZ21LUARPYY3OFFWCUWUU3IVR42IEUUREGHBL3F';

    function api_flickrGetPhotoInfo(pid, photo) {
        $.ajax({
            data: {
                method: 'flickr.photos.getInfo',
                api_key: flickrAPIKey,
                format: 'json',
                photo_id: pid
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            url: flickrAPIUrl,
            success: function(response) {
                setPhotoInfo(response, photo); // workaround to pass more than one parameter.
            },
            error: function(jqXHR, textStatus, errorThrown) {
                viewModel.errors.push(new Error(
                    'Flickr API Error',
                    'Could not retrieve Flickr search data.'
                    )
                );
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
            success: createLocations,
            error: function(jqXHR, textStatus, errorThrown) {
                viewModel.errors.push(new Error(
                    'Foursquare API Error',
                    'Could not retrieve Foursquare data.'
                    )
                );
            }
        }).done(function() {
            viewModel.createMarkers();
        });
    }

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
                categories,
                iconUrl
            );

            console.log(iconUrl);
            viewModel.locations.push(tmp);
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
                viewModel.errors.push(new Error(
                    'Flickr API Error',
                    'Could not retrieve Flickr search data.'
                    )
                );
            }
        });
    }

    function ViewModel() {
        this.appName = 'Neighborhood Map';
        this.latitude = 37.8083; // north
        this.longitude = -122.4156; // west
        this.searchTerm = ko.observable();
        this.photos = ko.observableArray();
        this.locations = ko.observableArray();

        this.errors = ko.observableArray();

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
        var markers = [];
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
                    title: location.name(),
                    icon: location.iconURL()
                });

                var contentString = '<div id="content">' +
                '<div id="siteNotice">' +
                '<h1 id="firstHeading" class="firstHeading">' + location.name() + '</h1>' +
                '<div id="bodyContent">' +
                '<p>' + location.description() + '</p>' +
                '<p>' + location.address() + '</p>' +
                '</div>' +
                '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });

                markers.push(marker);
            });
        };
    }

    /* Error
     * A class for a knockout-compatible error message to be displayed.
     */
    function Error(title, desc) {
        this.title = ko.observable(title);
        this.description = ko.observable(desc);
    }

    /* Location
     */
    function Location(name, address, desc, lat, lng, rating, categories, iconUrl) {
        this.address = ko.observable(address);
        this.name = ko.observable(name);
        this.description = ko.observable(desc);
        this.lat = ko.observable(lat);
        this.lng = ko.observable(lng);
        this.rating = ko.observable(rating);
        this.category = ko.observableArray(categories);
        this.iconURL = ko.observable(iconUrl);
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
        viewModel.photos.valueHasMutated();
    }

    var viewModel = new ViewModel();

    api_flickrSearch();
    api_foursquareExplore();

    ko.applyBindings(viewModel);
});