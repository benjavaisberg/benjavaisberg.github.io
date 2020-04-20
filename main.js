
//map coordinates
var gt_center = [33.774841, -84.396384]
var southWest = L.latLng(33.613569, -84.487616);
var northEast = L.latLng(33.949375, -84.131547);
var maxBounds = L.latLngBounds(southWest, northEast);

var destinations = [

        {"name": "Doraville", lat: 33.903145, lng: -84.280132,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 25,
                "uberCost": 14.7,
                "uberTime": 15
            }
        },
        {"name": "Buckhead", lat: 33.849121, lng: -84.368338,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 16,
                "uberCost": 13,
                "uberTime": 15
            }
        },
        {"name": "Little Five Points", lat: 33.765097, lng: -84.349290,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 37,
                "uberCost": 12,
                "uberTime": 10
            }
        },
        {"name": "Inman Park", lat: 33.757950, lng: -84.352598,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 30,
                "uberCost": 9,
                "uberTime": 11
            }
        },
        {"name": "Edgewood", lat: 33.754856, lng: -84.340974,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 27,
                "uberCost": 14.7,
                "uberTime": 14
            }
        },
        {"name": "Old Fourth Ward", lat: 33.764145, lng: -84.371331,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 36,
                "uberCost": 12,
                "uberTime": 11
            }
        },
        {"name": "Decatur", lat: 33.775295, lng: -84.282240,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 30,
                "uberCost": 18,
                "uberTime": 21
            }
        },
        {"name": "Airport", lat: 33.641215, lng: -84.428073,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 25,
                "uberCost": 17,
                "uberTime": 18
            }
        },
        {"name": "West Manor", lat: 33.736125, lng: -84.493658,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 54,
                "uberCost": 13,
                "uberTime": 17
            }
        },
        {"name": "GT/Midtown", lat: 33.774841, lng: -84.396384,
            "travel": {
                "martaCost": 0,
                "martaTime": 0,
                "uberCost": 0,
                "uberTime": 0
            }
        },
        {"name": "Toco Hills", lat: 33.815524, lng: -84.312671,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 58,
                "uberCost": 16,
                "uberTime": 18
            }
        },
        {"name": "Sandy Springs", lat: 33.930876, lng: -84.373602,
            "travel": {
                "martaCost": 2.5,
                "martaTime": 30,
                "uberCost": 13,
                "uberTime": 20
            }
        }
    ];


//initiate mapbox object
L.mapbox.accessToken = 'pk.eyJ1IjoiYmVuamF2YWlzYmVyZyIsImEiOiJjazhuZmw0c3YweHd6M2Vtd3NscXp4OTg2In0.TIzfy5d9qr7V6CQLJHczGg';
var map = new L.mapbox.map('map')
    .setView(gt_center, 11)
    .setMaxBounds(maxBounds)
    .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'))
    .setMinZoom(11);


// create circles on the map by coordinates
destinations.forEach(function(d) {
    d.LatLng = new L.LatLng(d.lat, d.lng);
    map.addLayer(L.circle([d.lat, d.lng], 500, {color: d.name == "GT/Midtown" ? 'red' : '#3388ff'}))
});


// Append <svg> to #map
var svg = d3.select(map.getPanes().overlayPane).append("svg")
    .attr("class", "leaflet-zoom-animated")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);


// Append <g> to <svg>
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

// Append <circle> to <g>
var circles = g.selectAll("circle")
    .data(destinations)
    .enter()
    .append("circle")
    .style("fill", function (d) {
        if (d.name == "Georgia Tech/Midtown") {
            return "rgba(255, 0, 0, .5)";
        } else {
            return "rgba(255, 255, 255, .5)";
        }
    });

// handle mouse events when circle is clicked
circles.on("mousedown", function(d) {

  d3.select(".time-svg").remove()
  d3.select(".cost-svg").remove()

// Change the id of the map div to change the size
  d3.select('#map')
      .attr("id", "map-shrunk")

    // Testing bug fix



// create SVG for charts
    var timeSvg = d3.select("body").append("svg")
      .attr('class', 'time-svg')
      .attr('width',400)
      .attr('height',380)
      .style('left', d3.select("#map-shrunk").node().getBoundingClientRect().width + 5);

    var costSvg = d3.select("body").append("svg")
      .attr('class', 'cost-svg')
      .attr('width',400)
      .attr('height',380)
      .style('left', d3.select("#map-shrunk").node().getBoundingClientRect().width + 5)
      .style('top', 340);

    var g2 = timeSvg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var g3 = costSvg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

//Map data to array to create bar charts
    var timeArr = [{key: 'martaTime', value: d.travel.martaTime}, {key: 'uberTime', value: d.travel.uberTime}];
    var costArr = [{key: 'martaCost', value: d.travel.martaCost}, {key: 'uberCost', value: d.travel.uberCost}];

// scale stuff
    var xScale = d3.scaleBand().range([0, 350]).padding(0.5);
    var yScale = d3.scaleLinear().range([250, 0]);
    xScale.domain([timeArr[0].key, timeArr[1].key]);
    yScale.domain([0, 50]);


    var xScale2 = d3.scaleBand().range([0, 350]).padding(0.5)
    var yScale2 = d3.scaleLinear().range([250, 0])
    xScale2.domain([costArr[0].key, costArr[1].key]);
    yScale2.domain([0,25]);

    g2.append("g")
             .attr("transform", "translate(0," + 250 + ")")
             .call(d3.axisBottom(xScale));

    g3.append("g")
             .attr("transform", "translate(0," + 250 + ")")
             .call(d3.axisBottom(xScale2));

    g2.append("g")
     .call(d3.axisLeft(yScale).tickFormat(function(d){
         return d;
        }).ticks(5))
     .append("text")
     .attr("y", 6)
     .attr("dy", "0.71em")
     .attr("text-anchor", "end")
     .text("value");

     g3.append("g")
         .call(d3.axisLeft(yScale2).tickFormat(function(d){
             return d;
            }).ticks(5))
         .append("text")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("value");

     var barsTime = g2.selectAll("rect")
         .data(timeArr)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d, i) {return xScale(timeArr[i].key)})
         .attr("y", function(d) {return yScale(d.value); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d, i) { return 248 - yScale(timeArr[i].value); });

    var barsCost = g3.selectAll("rect")
         .data(costArr)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d, i) {return xScale2(costArr[i].key)})
         .attr("y", function(d) {return yScale2(d.value); })
         .attr("width", xScale2.bandwidth())
         .attr("height", function(d, i) { return 248 - yScale2(costArr[i].value); });

    timeSvg.append("text")
        .attr("x", d3.select("#map-shrunk").node().getBoundingClientRect().width - 550)             
        .attr("y", 60)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("MARTA vs Uber Time Comparison from GT to: " + d.name);


    costSvg.append("text")
        .attr("x", d3.select("#map-shrunk").node().getBoundingClientRect().width - 550)             
        .attr("y", 90)
        .attr("text-anchor", "middle")  
        .style("font-size", "14px") 
        .style("text-decoration", "underline")  
        .text("MARTA vs Uber Cost Comparison from GT to: " + d.name);

    });


// circles.on("mouseout", function() { 
//   return d3.select(this).style("opacity", "0.5");
// });

function update() {
    d3.select(".time-svg").remove()
    d3.select(".cost-svg").remove()

// Change the id of the map div to change the size
    d3.select('#map-shrunk')
        .attr("id", "map")

    translateSVG()
    circles.attr("cx", function(d) { return map.latLngToLayerPoint(d.LatLng).x; })
    circles.attr("cy", function(d) { return map.latLngToLayerPoint(d.LatLng).y; })
    circles.attr("r", function(d) { return 0.005 * Math.pow(2, map.getZoom()); })
}

// Adjust the circles when the map is moved
function translateSVG() {
    var viewBoxLeft = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.x;
    var viewBoxTop = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.y;
    // Reszing width and height incase of window resize
    svg.attr("width", window.innerWidth)
    svg.attr("height", window.innerHeight)
      // Adding the ViewBox attribute to our SVG to contain it
    svg.attr("viewBox", function() {
      return "" + viewBoxLeft + " " + viewBoxTop + " " + window.innerWidth + " " + window.innerHeight;
    });
    // Adding the style attribute to our SVG to translate it
    svg.attr("style", function() {
      return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
    });
}

// Re-draw on reset, this keeps the markers where they should be on reset/zoom
map.on("moveend", update);
update();
