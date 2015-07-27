/* file: main.js */

jQuery(function($) {
    'use strict';

    var viewModel = new ViewModel();

    api_flickrSearch();
    api_foursquareExplore();

    ko.applyBindings(viewModel);
});