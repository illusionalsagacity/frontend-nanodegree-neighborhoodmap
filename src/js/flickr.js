var FlickrAPI = function(key, url) {
    this.key = key;
    this.url = url;
}

// fisherman's wharf: 28288708
FlickrAPI.prototype.photosSearch = function(woe_id) {
    return $.ajax({
        data: {
            method: 'flickr.photos.search',
            api_key: this.key,
            safe_search: 1,
            content_type: 1,
            woe_id: woe_id,
            format: 'json',
            per_page: 20
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        url: this.url
    });
};

FlickrAPI.prototype.photosGetInfo = function(photo_id) {
    return $.ajax({
        data: {
            method: 'flickr.photos.getInfo',
            api_key: this.key,
            format: 'json',
            photo_id: photo_id
        },
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        url: this.url,
    });
}

module.exports = FlickrAPI;