
var candies = [
  "candy-ferrero",
  "candy-bear",
  "candy-rabbit",
  "candy-hersheys"
]

// Initialize the session variable for each type of candy
for (i=0; i<candies.length; i++) {
  if (!localStorage.getItem(candies[i])) {
    localStorage.setItem(candies[i],0); // initialize at 0
    // localStorage.setItem(candies[i], Math.floor(Math.random() * 21)); // set equal to a random integer between 1-20
  }
}



// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiYmRmemx5bm4iLCJhIjoiY2puNHd5djlqMHR2MDNwcW84ZWZ6YTV1dCJ9.qaSTT_UoQ-lZNq8YQ5YB3Q'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-78.504,38.036], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 14.97, // set the default zoom programatically
	style: 'mapbox://styles/bdfzlynn/cjn4xaw5h1cf62rnvrf2jn4l8', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'City of Charlottesville Open Data Portal (http://opendata.charlottesville.org/)', // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#candy-jar").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});

//----------------------------------------------HOMEPAGE CODE---------------------------------------

$(".homepage-title>img").on('click', function() { // Click event handler for the modal's close button
    $("#homepageBackground").animate({left: '100%'},"slow");
});
//--------------------------------------------POPUPS CODE---------------------------------------------

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map
        console.log(e);
      var candy = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['candy-ferrero', 'candy-hersheys','candy-bear','candy-rabbit']   // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (candy.length == 0) {
        return;
    }

    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [15, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

      // Set the popup location based on each feature
      popup.setLngLat(candy[0].geometry.coordinates);

      // Set the contents of the popup window
        var layerName = candy[0].layer.id;
        var layerNameDisplay = layerName.replace("candy-","").toUpperCase();
      popup.setHTML( '<h3><strong>' + layerNameDisplay + '</strong></h3><p>' + candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p><button id="' + candy[0].properties.OBJECTID + '" class="' + layerName +  '" class="popupButton">Collect!</button>' );
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
 
        $(".mapboxgl-popup button:not(.mapboxgl-popup-close-button)").click(function(e) {
            var candyType = $(this).attr("class");
            var candyID = $(this).attr("id");
            var candyCount = parseInt(localStorage.getItem(candyType)) + 1;
            localStorage.setItem(candyType, candyCount);

            updateBarchart("#bar-chart");
        });

    });


//---------------------------------candyChart----------------------------------------

// Part one - bar chart

        // set the dimensions and margins of the graph
        var bcHeight = 250;
        var bcWidth = 400;
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = bcWidth - margin.left - margin.right,
            height = bcHeight - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);

        // append the svg object to the body of the page
        // append a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#bar-chart")
            
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", 
                  "translate(" + margin.left + "," + margin.top + ")");

        updateBarchart("#bar-chart");

    function updateBarchart(element) {

        var svg = d3.select(element).select("g");   // Using select instead of selectAll selects only the first svg group (g) in the bar chart. 

        svg.html(""); // clears current barchart by replacing contents with empty html

        // map the localstorage variables for each candy to a data array
        var data = [];
        for (i=0; i<candies.length; i++) {
          // get the session variable for each candy type (the candy count)
          // the format of each element in the array will be {candyType: "candy-bear", candyCount: 3}
          data.push({candyType: candies[i], candyCount: +localStorage.getItem(candies[i])});
        }

        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.candyType; }));
        y.domain([0, d3.max(data, function(d) { return d.candyCount; })]);

        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.candyType); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.candyCount); })
            
            .attr("height", function(d) { return height - y(d.candyCount); });

        // add the x Axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y));
    }


//map.on('click', function(e) {  
//      var candy = map.queryRenderedFeatures(e.point, { 
//        layers: ['candy-hersheys']  
//    });
//      if (candy.length == 0) {
//        return;
//    }
//    var popup = new mapboxgl.Popup({ 
//        closeButton: true,
//        closeOnClick: true, 
//        anchor: 'bottom',
//        offset: [15, -15] 
//    });
//
//      popup.setLngLat(candy[0].geometry.coordinates)
//      popup.setHTML( '<strong>HERSHEY\'S</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
//           
//      popup.addTo(map);  
//  });
//
//map.on('click', function(e) {  
//      var candy = map.queryRenderedFeatures(e.point, { 
//        layers: ['candy-bear']  
//    });
//      if (candy.length == 0) {
//        return;
//    }
//    var popup = new mapboxgl.Popup({ 
//        closeButton: true,
//        closeOnClick: true, 
//        anchor: 'bottom',
//        offset: [15, -15] 
//    });
//
//      popup.setLngLat(candy[0].geometry.coordinates)
//      popup.setHTML( '<strong>GUMMY BEAR</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
//           
//      popup.addTo(map);  
//  });
//
//map.on('click', function(e) {  
//      var candy = map.queryRenderedFeatures(e.point, { 
//        layers: ['candy-rabbit']  
//    });
//      if (candy.length == 0) {
//        return;
//    }
//    var popup = new mapboxgl.Popup({ 
//        closeButton: true,
//        closeOnClick: true, 
//        anchor: 'bottom',
//        offset: [15, -15] 
//    });
//
//      popup.setLngLat(candy[0].geometry.coordinates)
//      popup.setHTML( '<strong>WHITE RABBIT</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
//           
//      popup.addTo(map);  
//  });




//----------------------------------------SHOW/HIDE LAYERS--------------------------------------------

// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['candy-ferrero', 'FERRERO'],                      // layers[0]
        ['candy-hersheys', 'HERSHEY\'s'], 
        ['candy-bear', 'GUMMY BEAR'],
        ['candy-rabbit', 'WHITE RABBIT'],
    ]; 

    // functions to perform when map loads
        map.on('load', function () {
        
        
//        for (i=0; i<layers.length; i++) {
//
//            // add a button for each layer
//            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + "<p></p>"  + "<p></p>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
//        }

        // show/hide layers when button is clicked
        $(".candyShow>img").on('click', function(e) {

                var clickedLayer = $(this).parents('.candyShow');
                var clickedLayerName = $(this).parents('.candyShow').attr('id');
            
                console.log(clickedLayer);
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayerName, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayerName, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(clickedLayer).removeClass('active');
                } else {
                    $(clickedLayer).addClass('active');
                    map.setLayoutProperty(clickedLayerName, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
//            
//            
//                var slides = document.getElementsByClassName("e.target.id");
//                if (slides.style.display === "none") {
//                    slides.style.display = "block";
//                } else {
//                    slides.style.display = "none";
//                }
//            
    });
 })


//----------------------------SCROLL TO ZOOM THROUGH SITES-----------------------------------
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        
        'ferrero': {
            displayname: "FERRERO",
            description: "What do you call a group of a dozen atoms?",
            imagepath: "img/Ferrero_2.svg",
            bearing: 0,//angle//
            center: [ -78.495,38.038],
            zoom: 18.46,
            pitch: 0
        },
        'heysheys': {
            displayname: "HEYSHEY'S",
            description: "Why don\'t tall mountains ever catch a cold?",
            imagepath: "img/Hershey_1.svg",
            bearing: 0,
            center: [ -78.505,38.034],
            zoom: 18.46,
            pitch: 0
        },
        'gummy-bear': {
            displayname: "GUMMY BEAR",
            description: "They are dark and on the run, without sun there will be none. What are they?",
            imagepath: "img/Bear_2.svg",
            bearing: 0,
            center: [ -78.488,38.025],
            zoom: 18.46,
            pitch: 0
        },
        'white-rabbit': {
            displayname: "WHITE RABBIT",
            description: "What five letter word stays the same when you take away the first, third, and last letter?",
            imagepath: "img/white_rabbit.svg",
            bearing: 0,
            center: [-78.496,38.037],
            zoom: 18.46,
            pitch: 0
        }
    };

    console.log(chapters['ferrero']['displayname']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h2>" + chapters[key]['displayname'] + "</h2><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }





//-----------------------------sideslide-------------------
 
$(document).ready(function()
{
  $('#pollSlider-button').click(function() {
    if($(this).css("margin-right") == "300px")
    {
        $('#chapters').animate({"margin-right": '-=550'});
        $('#sidebar').animate({"margin-right": '-=300'});
        $('#pollSlider-button').animate({"margin-right": '-=300'});
        $('#pollSlider-button-text').animate({"margin-right": '-=300'});
        
    }
    else
    {
        $('#chapters').animate({"margin-right": '+=550'});
        $('#sidebar').animate({"margin-right": '+=300'});
        $('#pollSlider-button').animate({"margin-right": '+=300'});
        $('#pollSlider-button-text').animate({"margin-right": '+=300'});
    }


  });
 });     

//--------------------------scroll-------------------------------

//$(window).on("load",function() {
//  function fade(pageLoad) {
//    var windowTop=$(window).scrollTop(), windowBottom=windowTop+$(window).innerHeight();
//    var min=0.01, max=1, threshold=0.01;
//    
//    $(".fade").each(function() {
//      /* Check the location of each desired element */
//      var objectHeight=$(this).outerHeight()+400, objectTop=$(this).offset().top-200, objectBottom=$(this).offset().top+objectHeight-200;
//      
//      /* Fade element in/out based on its visible percentage */
//      if (objectTop < windowTop) {
//        if (objectBottom > windowTop) {$(this).fadeTo(0,min+((max-min)*((objectBottom-windowTop)/objectHeight)));}
//        else if ($(this).css("opacity")>=min+threshold || pageLoad) {$(this).fadeTo(0,min);}
//      } else if (objectBottom > windowBottom) {
//        if (objectTop < windowBottom) {$(this).fadeTo(0,min+((max-min)*((windowBottom-objectTop)/objectHeight)));}
//        else if ($(this).css("opacity")>=min+threshold || pageLoad) {$(this).fadeTo(0,min);}
//      } else if ($(this).css("opacity")<=max-threshold || pageLoad) {$(this).fadeTo(0,max);}
//    });
//  } fade(true); //fade elements on page-load
//  $(window).scroll(function(){fade(false);}); //fade elements on scroll
//});





