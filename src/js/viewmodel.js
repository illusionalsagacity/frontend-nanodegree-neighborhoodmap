/* viewmodel.js */

function ViewModel() {
    var self = this;

    self.appName = 'Neighborhood Map';
    self.latitude = 37.8083; // north
    self.longitude = -122.4156; // west
    self.searchTerm = ko.observable();
    self.photos = ko.observableArray();
    self.locations = ko.observableArray();

    var mystuff = ko.search.setData(self.locations());

    self.errors = ko.observableArray();

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

    var
        normalIcon,
        selectedMarker,
        selectedInfoWindow,
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // TODO: finish.
    this.searchFor = function(formElement) {

    }

    self.createMarkers = function() {
        self.locations().forEach(function(location) {
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
                content: contentString,
                maxWidth: 400
            });

            google.maps.event.addListener(marker, 'click', function() {
                if (selectedInfoWindow) {
                    selectedInfoWindow.close();
                }

                infowindow.open(map, marker);
                selectedInfoWindow = infowindow;

                if (selectedMarker) {
                    selectedMarker.setIcon(normalIcon);
                }

                normalIcon = marker.getIcon();
                marker.setIcon('img/pin66.png');
                selectedMarker = marker;
            });
        });
    };
}
