


$(document).ready(function() {
    $('#flipbook input.scrapbook-location-input').geocomplete({
        // Use Google Maps Places API to autocomplete the field
        // while the user is entering information.

    }).bind("geocode:result", function(event, result) {
            var scrapbookName = event.currentTarget.parentElement.innerText;
            scrapbookName = $.trim(scrapbookName);



            var locationObject = {
                address: result.formatted_address,
                vicinity: result.vicinity,
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
                place_id: result.place_id
            };

            console.log(locationObject);

            $.ajax({
                url: '/scrapbook/'+scrapbookName+'/save-location',
                type: 'POST',
                data: locationObject,
                success: function() {
                    // nothing
                },
                dataType: 'json'
            });
        });





    $('#flipbook input.photo-location-input').geocomplete({

    }).bind("geocode:result", function(event, result) {
            var photoName = event.currentTarget.parentElement.innerText;
            photoName = $.trim(photoName);

            if(photoName === "") {
                alert("Please first enter a name for your photo.");
                return;
            }

            var locationObject = {
                address: result.formatted_address,
                vicinity: result.vicinity,
                latitude: result.geometry.location.lat(),
                longitude: result.geometry.location.lng(),
                place_id: result.place_id
            };

            var jQueryNode = $($(event.currentTarget).parents('.scrapbook-photo')[0]);

            var scrapbookName = $.trim(jQueryNode.attr('parent-scrapbook'));


            $.ajax({
                url: '/scrapbook/'+scrapbookName+'/'+photoName+'/save-location',
                type: 'POST',
                data: locationObject,
                success: function() {
                    // nothing
                },
                dataType: 'json'
            });
        });





    $('#flipbook input.photo-name-input').keydown(function(event) {
        if(event.keyCode !== 13) {
            return;
        }

        var photoName = event.currentTarget.value;
        photoName = $.trim(photoName);

        if(photoName === "") {
            alert("Please enter a name containing non whitespace characters");
            return;
        }

        var jQueryNode = $($(event.currentTarget).parents('.scrapbook-photo')[0]);
        var parentAlbumName = $.trim(jQueryNode.attr('parent-scrapbook'));

        var photoId = $.trim(jQueryNode.attr('photo-id'));

        var anchorElement = $(event.currentTarget.parentElement).prevAll('a')[0];
        var imgElement = $(anchorElement.children[0]);
        var photoUrl = $.trim(imgElement.attr('src'));

        $.ajax({
            url: '/scrapbook/'+parentAlbumName+'/'+photoName+'/save-name',
            type: 'POST',
            data: {
                _id: photoId,
                url: photoUrl
            },
            success: function(){
                // nothing
            },
            dataType: 'json'
        });


    });
});