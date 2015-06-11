/* file: main.js */

(function($) {
	'use strict';

	// TODO: use jquery to append a new carousel item.
	var numPictures = 0;

	var carousel = {
		indicatorHTML: [],
		itemHTML: [],
		captionHTML: []
	};

	function createCarouselItem(src) {
		var indicatorHTML = '<li data-target="#flickr-content" data-slide-to=' + numPictures;
		var itemHTML = '<div class="item'
		if (numPictures === 0) {
			indicatorHTML += ' class="active"></li>';
			itemHTML += ' active"><img class="img-responsive" src="' + src + '"></div>';
		} else {
			indicatorHTML += '></li>';
			itemHTML += '"><img src="' + src + '"></div>';
		}
		carousel.indicatorHTML.push(indicatorHTML);
		carousel.itemHTML.push(itemHTML);
		numPictures++;
	}

	function insertCarouselItems() {
		carousel.indicatorHTML.forEach(function(element, index, array) {
			$('.carousel-indicators').append(element);
		});
		carousel.itemHTML.forEach(function(element, index, array) {
			$('.carousel-inner').append(element);
		});
	}

	function getFlickrPhotoInfo(pid) {
		var query = 'https://api.flickr.com/services/rest/';
		$.ajax({
			data: {
				method: 'flickr.photos.getInfo',
				api_key: '6b24b2e754fe7ea499e2db41d1daa866',
				format: 'json',
				photo_id: pid
			},
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			url: query,
			success: function(response) {
				var captionHTML = '<div class="carousel-caption">';
				if (response.photo.owner.realname !== '') {
					captionHTML += '<p>' + response.photo.owner.realname + '</p>';
				}
				if (response.photo.owner.username !== '') {
					captionHTML += '<p>' + response.photo.owner.username + '</p>';
				}
				if (response.photo.description._content !== '') {
					captionHTML += '<p>' + response.photo.description._content + '</p>';
				}
				captionHTML += '</div>';
				carousel.captionHTML.push(captionHTML);
			}
		});
	}

	function searchFlickr() {
		var query = 'https://api.flickr.com/services/rest/';
		$.ajax({
			data: {
				method: 'flickr.photos.search',
				api_key: '6b24b2e754fe7ea499e2db41d1daa866',
				safe_search: 1,
				content_type: 1,
				woe_id: 28288708,
				format: 'json',
				per_page: 20
			},
			dataType: 'jsonp',
			jsonp: 'jsoncallback',
			url: query,
			success: function(response) {
				$.each(response.photos.photo, function(i, photo) {
					var base_url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
					createCarouselItem(base_url);
					getFlickrPhotoInfo(photo.id);
				});
				insertCarouselItems();
			}
		});
	}

	function ViewModel() {
		this.appName = 'Neighborhood Map';
		this.latitude = 37.8083; // north
		this.longitude = -122.4156; // west
		this.searchTerm = ko.observable();
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

	ko.applyBindings(new ViewModel());

	searchFlickr();
	console.log(carousel);
})(jQuery);