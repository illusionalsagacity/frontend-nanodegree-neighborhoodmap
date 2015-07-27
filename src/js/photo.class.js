/* photo.class.js */

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