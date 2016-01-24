


// note that we are currently using google maps v3 WITHOUT an API key.
// should we expect heavy traffic, we will have to use an API key.

$.getScript("js/lib/googlemaps.js", function() {
    console.log('maps loaded');
    var mapOptions = {
        center: new google.maps.LatLng(12.2484861, 109.183363),
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);


    console.log(document.getElementById('map'));
    console.log(new google.maps.LatLng(12.2484861, 109.183363));

    console.log(map);

    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
});

$(document).ready(function() {


    var events = [
        {dates: [new Date(2011, 2, 31)], title: "2011 Season Opener", section: 0},
        {dates: [new Date(2012, 1, 29)], title: "Spring Training Begins", section: 2},
        {dates: [new Date(2012, 3, 5)], title: "Atlanta Braves @ New York Mets Game 1", section: 1},
        {dates: [new Date(2012, 3, 7)], title: "Atlanta Braves @ New York Mets Game 2", section: 1},
        {dates: [new Date(2012, 3, 8)], title: "Atlanta Braves @ New York Mets Game 3", section: 1},
        {dates: [new Date(2012, 3, 9), new Date(2012, 3, 11)], title: "Atlanta Braves @ Houston Astros", section: 1},
        {dates: [new Date(2012, 3, 13), new Date(2012, 3, 15)], title: "Milwaukee Brewers @ Atlanta Braves", section: 1},
        {dates: [new Date(2012, 3, 9), new Date(2012, 3, 11)], title: "Boston Red Sox @ Toronto Blue Jays", section: 1},
        {dates: [new Date(2012, 3, 13), new Date(2012, 3, 15)], title: "Baltimore Orioles @ Toronto Blue Jays", section: 1},
        {dates: [new Date(2012, 3, 17), new Date(2012, 3, 19)], title: "Tampa Bay Rays @ Toronto Blue Jays", section: 1},
        {dates: [new Date(2012, 3, 20), new Date(2012, 3, 23)], title: "Toronto Blue Jays @ Kansas City Royals", section: 1},
        {dates: [new Date(2012, 3, 5)], title: "Opening Day for 12 Teams", section: 1},
        {dates: [new Date(2012, 2, 28)], title: "Seattle Mariners v. Oakland A's", section: 1, description: "Played in Japan!"},
        {dates: [new Date(2012, 4, 18), new Date(2012, 5, 24)], title: "Fuck you Play", section: 1},
        {dates: [new Date(2012, 5, 10)], title: "All-Star Game", section: 1},
        {dates: [new Date(2012, 9, 24)], title: "World Series Begins", section: 3}
    ];

    var sections = [
        {dates: [new Date(2011, 2, 31), new Date(2011, 9, 28)], title: "2011 MLB Season", section: 0, attrs: {fill: "#d4e3fd"}},
        {dates: [new Date(2012, 2, 28), new Date(2012, 9, 3)], title: "2012 MLB Regular Season", section: 1, attrs: {fill: "#d4e3fd"}},
        {dates: [new Date(2012, 1, 29), new Date(2012, 3, 4)], title: "Spring Training", section: 2, attrs: {fill: "#eaf0fa"}},
        {dates: [new Date(2012, 9, 4), new Date(2012, 9, 31)], title: "2012 MLB Playoffs", section: 3, attrs: {fill: "#eaf0fa"}}
    ];

    var timeline = new Chronoline($("#timeline").get(0), events, {
        animated: true,
        tooltips: true,
        defaultStartDate: new Date(2012, 2, 5),
        sections: sections,
        sectionLabelAttrs: {
            'fill': '#997e3d',
            'font-weight': 'bold'
        }
    });


});