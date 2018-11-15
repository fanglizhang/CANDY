// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiYmRmemx5bm4iLCJhIjoiY2puNHd5djlqMHR2MDNwcW84ZWZ6YTV1dCJ9.qaSTT_UoQ-lZNq8YQ5YB3Q'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-78.491,38.036], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 14, // set the default zoom programatically
	style: 'mapbox://styles/bdfzlynn/cjn4xaw5h1cf62rnvrf2jn4l8', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'City of Charlottesville Open Data Portal (http://opendata.charlottesville.org/)', // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});


//-----------------------legend-------------------------
// Legend
//var layers = [ // an array of the possible values you want to show in your legend
//    'Civic Spaces',
//    'Community Park',
//    'Neighborhood Park',
//    'Cemetery',
//    'Urban Park',
//    'Regional Park'
//];
//
//var colors = [ // an array of the color values for each legend item
//    '#800000',
//    '#800030',
//    '#800060',
//    '#80006c',
//    '#800090',
//    '#80009c'
//];
//
//// for loop to create individual legend items
//for (i=0; i<layers.length; i++) {
//    var layer =layers[i]; // name of the current legend item, from the layers array
//    var color =colors[i]; // color value of the current legend item, from the colors array 
//    
//    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
//    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
//    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
//    legendKey.css("background", color); // change the background color of the legend key
//}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

//    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 
//
//        var ferrero = map.queryRenderedFeatures(e.point, {    
//            layers: ['candy-ferrero']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
//        });
//              
//        if (ferrero.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state
//
//            $('#info-window-body').html('<h3><strong>' + ferrero[0].properties.DATE + '<p></strong></h3><img class="candy-image" src="img/ferrero.png"> </p>' + ferrero[0].properties.QUESTION );
//
//        } else {    // what shows up in the info window if you are NOT hovering over a park
//
//            $('#info-window-body').html('<p>Not hovering over a <strong>candy</strong> right now.</p>');
//            
//        }
//
//    });

// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var candy = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['candy-ferrero']   // replace this with the name of the layer from the Mapbox Studio layers panel
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
      popup.setHTML( '<strong>FERRERO</strong></h3><p>' + candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });

map.on('click', function(e) {  
      var candy = map.queryRenderedFeatures(e.point, { 
        layers: ['candy-hersheys']  
    });
      if (candy.length == 0) {
        return;
    }
    var popup = new mapboxgl.Popup({ 
        closeButton: true,
        closeOnClick: true, 
        anchor: 'bottom',
        offset: [15, -15] 
    });

      popup.setLngLat(candy[0].geometry.coordinates)
      popup.setHTML( '<strong>HERSHEY\'S</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
           
      popup.addTo(map);  
  });

map.on('click', function(e) {  
      var candy = map.queryRenderedFeatures(e.point, { 
        layers: ['candy-bear']  
    });
      if (candy.length == 0) {
        return;
    }
    var popup = new mapboxgl.Popup({ 
        closeButton: true,
        closeOnClick: true, 
        anchor: 'bottom',
        offset: [15, -15] 
    });

      popup.setLngLat(candy[0].geometry.coordinates)
      popup.setHTML( '<strong>GUMMY BEAR</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
           
      popup.addTo(map);  
  });

map.on('click', function(e) {  
      var candy = map.queryRenderedFeatures(e.point, { 
        layers: ['candy-rabbit']  
    });
      if (candy.length == 0) {
        return;
    }
    var popup = new mapboxgl.Popup({ 
        closeButton: true,
        closeOnClick: true, 
        anchor: 'bottom',
        offset: [15, -15] 
    });

      popup.setLngLat(candy[0].geometry.coordinates)
      popup.setHTML( '<strong>WHITE RABBIT</strong></h3><p>'+ candy[0].properties.DATE + '</h3><p>' + candy[0].properties.QUESTION + '</p>');
           
      popup.addTo(map);  
  });


// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['candy-ferrero', 'ferrero'],                      // layers[0]
        ['candy-hersheys', 'hersheys'], 
        ['candy-bear', 'bear'],
        ['candy-rabbit', 'rabbit'],
    ]; 

    // functions to perform when map loads
        map.on('load', function () {
        
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
        }

        // show/hide layers when button is clicked
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;

                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
            
            console.log(e.target.id)
            
//                var slides = document.getElementsByClassName("e.target.id");
//                if (slides.style.display === "none") {
//                    slides.style.display = "block";
//                } else {
//                    slides.style.display = "none";
//                }
            
    });
 })



//--------------------------------------------showlayer backup---------------------------------
//var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)
//
//        // [layerMachineName, layerDisplayName]
//        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
//        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
//        ['candy-ferrero', 'ferrero'],                      // layers[0]
//        ['candy-hersheys', 'hersheys'],                              
////        ['candy-points', 'Bike Lanes'],     
////        ['candy-points', 'Bus Stop Heatmap'],
////        ['candy-points', 'Map background']
//        // add additional live data layers here as needed
//    ]; 
//
//    // functions to perform when map loads
//    map.on('load', function () {
//        
//        
//        for (i=0; i<layers.length; i++) {
//
//            // add a button for each layer
//            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>"); // see http://api.jquery.com/append/
//        }
//
//        // show/hide layers when button is clicked
//        $("#layers-control>a").on('click', function(e) {
//
//                var clickedLayer = e.target.id;
//
//                e.preventDefault();
//                e.stopPropagation();
//
//                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
//                console.log(visibility);
//
//                if (visibility === 'visible') {
//                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
//                    $(e.target).removeClass('active');
//                } else {
//                    $(e.target).addClass('active');
//                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
//                }
//            
//            console.log(e.target.id)
//            
////                var slides = document.getElementsByClassName("e.target.id");
////                if (slides.style.display === "none") {
////                    slides.style.display = "block";
////                } else {
////                    slides.style.display = "none";
////                }
//            
//    });
// })
//---------------------------------------------------------------------
// CHANGE LAYER STYLE
// Refer to example at https://www.mapbox.com/mapbox-gl-js/example/color-switcher/
    
//    var swatches = $("#swatches");
//
//    var colors = [  // an array of color options for the bus stop ponts
//        '#F44336',
//        '#e91e63',
//        '#9c27b0',
//        '#673ab7'
//    ]; 
//
//    var layer = 'cville-bus-stops';
//
//    colors.forEach(function(color) {
//        var swatch = $("<button class='swatch'></button>").appendTo(swatches);
//
//        $(swatch).css('background-color', color); 
//
//        $(swatch).on('click', function() {
//            map.setPaintProperty(layer, 'circle-color', color); // 'circle-color' is a property specific to a circle layer. Read more about what values to use for different style properties and different types of layers at https://www.mapbox.com/mapbox-gl-js/style-spec/#layers
//        });
//
//        $(swatches).append(swatch);
//    });

// 11.08 starts here----------------------------------------------
// SCROLL TO ZOOM THROUGH SITES
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        
        'ferrero': {
            displayname: "FERRERO",
            description: "Can you name 20 countries and their capital cities?",
            imagepath: "img/Ferrero_2.svg",
            bearing: 0,//angle//
            center: [ -78.495,38.038],
            zoom: 18.46,
            pitch: 0
        },
        'heysheys': {
            displayname: "HEYSHEY'S",
            description: "What color did Rachel wear when she was flying out of nearby Newark Airport in The Last One - Part 2 episode? ",
            imagepath: "img/Hershey_1.svg",
            bearing: 0,
            center: [ -78.505,38.034],
            zoom: 18.46,
            pitch: 0
        },
        'gummy-bear': {
            displayname: "GUMMY BEAR",
            description: "How many students graduated this spring at A-school?",
            imagepath: "img/Bear_2.svg",
            bearing: 20,
            center: [ -78.488,38.025],
            zoom: 18.46,
            pitch: 50
        },
        'white-rabbit': {
            displayname: "WHITE RABBIT",
            description: "When is Spring Festival in 2019?",
            imagepath: "img/white_rabbit.svg",
            bearing: 0,
            center: [-78.496,38.037],
            zoom: 18.46,
            pitch: 25
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


// ADD GEOJSON DATA (static layers)

    // See example at https://www.mapbox.com/mapbox-gl-js/example/live-geojson/


//    var staticUrl = 'https://opendata.arcgis.com/datasets/edaeb963c9464edeb14fea9c7f0135e3_11.geojson';//replace with yours//
//    map.on('load', function () {
//        window.setInterval(function() { // window.setInterval allows you to repeat a task on a time interval. See https://www.w3schools.com/jsref/met_win_setinterval.asp
//            console.log();
//            map.getSource('polling-places' ).setData(staticUrl);//chaining function////replace with yours//
//        }, 2000); // 2000 is in milliseconds, so every 2 seconds. Change this number as needed but be aware that more frequent requests will be more processor-intensive, expecially for large datasets.
//        
//        map.addSource('polling-places', { type: 'geojson', data: staticUrl });
//        map.addLayer({
//            "id": "polling-places",
//            "type": "symbol",
//            "source": "polling-places",
//            "layout": {
//                "icon-image": "embassy-15"//see more icons on mapbox maki icon//
//            
//            }
//        });
//    });



//----------------------slide shift------------------------------------------------

//var animate;
//var original = null;
//
//function moveRight(imgObj, amountToMoveTotal, amountToMovePerStep, timeToWaitBeforeNextIncrement)
//{
//    //Copy original image location
//    if (original === null){
//        original = parseInt(imgObj.style.left);
//    }
//
//    //Check if the image has moved the distance requested
//    //If the image has not moved requested distance continue moving.
//    if (parseInt(imgObj.style.left) < amountToMoveTotal) {
//        imgObj.style.left = (parseInt(imgObj.style.left) + amountToMovePerStep) + 'px';
//
//        animate = setTimeout(function(){moveRight(imgObj, amountToMoveTotal, amountToMovePerStep, timeToWaitBeforeNextIncrement);},timeToWaitBeforeNextIncrement);
//    }else {
//        imgObj.style.left = original;
//        original = null;        
//        clearTimeout(animate);
//    }
//}
//function fadeIn(imgObj, amountToFadeTotal, amountToFadePerStep, timeToWaitBeforeNextIncrement)
//{
//    //Copy original opacity
//    if (original === null){
//        original = parseFloat(imgObj.style.opacity);
//    }
//
//    //Check if the image has faded the amount requested
//    //If the image has not faded requested amount continue fading.
//    if (parseFloat(imgObj.style.opacity) < amountToFadeTotal) {
//        imgObj.style.opacity = (parseFloat(imgObj.style.opacity) + amountToFadePerStep);
//
//        animate = setTimeout(function(){fadeIn(imgObj, amountToFadeTotal, amountToFadePerStep, timeToWaitBeforeNextIncrement);},timeToWaitBeforeNextIncrement);
//    }else {
//        imgObj.style.opacity = original;
//        original = null;
//        clearTimeout(animate);
//    }

//-------------------------slideshow----------------------------

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1} 
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  
    

    slides[slideIndex-1].style.display = "block"; 
    dots[slideIndex-1].className += " active"; 
   

}
      

 
// Toggle a sliding animation animation

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
