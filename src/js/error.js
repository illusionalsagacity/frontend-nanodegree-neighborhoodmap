/* error.class.js */
/* Error
 * A class for a knockout-compatible error message to be displayed.
 */
var Error = function(title, desc) {
	'use strict';
    this.title = ko.observable(title);
    this.description = ko.observable(desc);
};

module.exports = Error;
