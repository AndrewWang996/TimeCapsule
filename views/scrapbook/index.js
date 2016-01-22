
console.log("index loaded");

var scrapbookController = GLOBAL.scrapbookController;


$(document).ready(function() {
    $('#flipbook input').geocomplete({
        // Use Google Maps Places API to autocomplete the field
        // while the user is entering information.

    }).bind("geocode:result", function(event, result) {
            var scrapbookName = event.currentTarget.parentElement.innerText;
            scrapbookName = $.trim(scrapbookName);
            console.log(scrapbookName);
            console.log(result);

            var locationObject = {
                address: result.formatted_address,
                vicinity: result.vicinity,
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
                placeId: result.place_id
            };

            $.post('/scrapbook/' + scrapbookName + '/save', {
                location: locationObject
            }, function(data, status) {
                console.log('data = ' + data + 'status = ' + status);
            });


            // when the user presses enter (?), and the geocoding returns a result,
            // run the function here.
        });
});