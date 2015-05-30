/* file: main.js */

(function($) {
	'use strict';

	function ViewModel() {
		this.appName = 'Neighborhood Map';
		this.latitude = 37.8083; // north
		this.longitude = -122.4156; // west
		this.searchTerm = ko.observable();
		this.locations = ko.observableArray([
			{
				name: 'Harry\'s Diner',
				description: 'A small diner!',
			},
			{
				name: 'McDonald\'s',
				description: 'A fast food resturant chain.',
			},
		]);

		this.searchFor = function(formElement) {
			var text = $('#search', formElement).val();
			console.log(text);
			alert(text);
		};
	}

	function initialize() {
		var latLng = new google.maps.LatLng(37.8083, -122.4156);
		var mapOptions = {
			center: latLng,
			draggable: false,
			scrollwheel: false,
			zoom: 17,
			zoomControl: false,
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	}
	google.maps.event.addDomListener(window, 'load', initialize);

	ko.applyBindings(new ViewModel());
})(jQuery);