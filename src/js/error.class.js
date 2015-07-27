/* error.class.js */
/* Error
 * A class for a knockout-compatible error message to be displayed.
 */
function Error(title, desc) {
    this.title = ko.observable(title);
    this.description = ko.observable(desc);
}
