/* photo.js */

/* Photo
 * A knockout-compatible class for flickr images.
 * fileext is a string like 'jpg' or 'png'.
 */
var Photo = function(farm, server, id, secret, size, fileext, realname, username, description) {
    'use strict';

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
};

/* Updates the photo's information from flickr api json response data.
 */
Photo.prototype.setInfo = function(data) {
    this.realname(data.photo.owner.realname)
        .username(data.photo.owner.username)
        .description(data.photo.description._content);
}

module.exports = Photo;