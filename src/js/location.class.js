/* location.class.js */
function Location(name, address, desc, lat, lng, rating, ratingColor, categories, iconUrl) {
    this.address = ko.observable(address);
    this.name = ko.observable(name);
    this.description = ko.observable(desc);
    this.lat = ko.observable(lat);
    this.lng = ko.observable(lng);
    this.rating = ko.observable(rating);
    this.ratingColor = ko.observable(ratingColor)
    this.category = ko.observableArray(categories);
    this.iconURL = ko.observable(iconUrl);
}