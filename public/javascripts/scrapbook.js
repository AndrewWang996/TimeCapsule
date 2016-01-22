
console.log("index loaded");


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
                place_id: result.place_id
            };

            $.ajax({url: '/scrapbook/'+scrapbookName+'/save',
                type: 'POST',
                data: locationObject,
                success: function() {

                },
                dataType: 'json'
            });
        });
});