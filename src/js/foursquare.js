require("isomorphic-fetch");

var FoursquareAPI = function(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;
};

// ll: '37.8083,-122.4156'
// v: '20150717'

//TODO: refactor this to use fetch and native promises.
FoursquareAPI.prototype.explore = function(ll, v) {
    return $.ajax({
        data: {
            client_id: this.client_id,
            client_secret: this.client_secret,
            ll: ll,
            v: v
        },
        dataType: 'jsonp',
        url: 'https://api.foursquare.com/v2/venues/explore',
    });
};

module.exports = FoursquareAPI;
