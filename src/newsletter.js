

/**
 * The event handler triggered when editing the spreadsheet.
 * @param {Event} e The onEdit event.
 */
function onEdit(e) {
    // Set a comment on the edited cell to indicate when it was changed.
    var range = e.range;
    range.setNote('Last modified: ' + new Date());
}