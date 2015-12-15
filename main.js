var _countries = {};

var canvas;
var ctx;

$(document).on('ready', function() {
    $.ajax({
        type: 'GET',
        url: '/data.json',
        dataType: "json",
        success: function (data) {
          iterateOnGroups(data.groups, $('body'));
        },
        error: function(err) {
          console.log("!--- Error ---!");
          console.log(err);
        }
    });

    canvas = document.getElementById("video-overlay");
    ctx = canvas.getContext('2d');
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    drawVideoOverlay();

    $(window).on('resize', function(){
      drawVideoOverlay();
    });

});



function drawVideoOverlay() {
  var width = canvas.width;
  var height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  var PIXEL_SIZE = width * .03;
  var totalXPixels = (width / PIXEL_SIZE) + 1;
  var totalYPixels = (height / PIXEL_SIZE) + 1;

  for (var xIndex = 0; xIndex < totalXPixels; xIndex++) {
    for (var yIndex = 0; yIndex < totalYPixels; yIndex++) {
      var opacity = getRandomArbitrary(0.3, 0.5);
      ctx.fillStyle = "rgba(0, 0, 0," + opacity + " )";
      ctx.fillRect(xIndex * PIXEL_SIZE, yIndex * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    }
  }

  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, width, height);
}

function createBindings() {

    $(".flag").hover(function() {
        var $flag = $(this);
        $flag.addClass("pulse");
        $flag.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass("pulse");
        });
    }, function(){

    });

    $(".flag").click(function() {
        var letterCode = $(this).attr("country");
        buildCountryModal(_countries[letterCode]);
    });
}

function buildCountryModal(country) {
  var description = country.name;
  if (country.contributions_past != undefined) {
    // do shit
  }
  // more sht
  console.log(country);
}

function iterateOnGroups(groups, $start_container) {
    groups.forEach(function(element, index, array) {
        if (element._comment !== undefined) {
          return;
        }

        // Gather data on the group
        var name = element.name;

        // Create framing markup
        var $new_container = $("<div></div>");
        $new_container.addClass("container animated");
        $new_container.attr('group', name);

        // Add a fade in animation
        var fadeChoices = ["fadeInDownBig", "fadeInLeftBig", "fadeInRightBig", "fadeInUpBig"];
        var fade = fadeChoices[Math.floor(Math.random() * fadeChoices.length)];
        $new_container.addClass(fade);

        // Decide on border style
        // Nobody wants to look like there parents
        var parentStyle = $start_container.hasClass('border-dashed');
        if (!parentStyle) {
          $new_container.addClass("border-dashed");
        }

        // Create header
        var $header = $("<h1></h1>");
        $header.addClass("header");
        $header.text(name);
        $new_container.append($header);

        // Iterate over countries
        var totalCountries = iterateOnCountries(element.countries, $new_container);

        // If there are several countries present, decrease the size of the container
        if (totalCountries > 6) {
          $new_container.css("width", "40%");
        }

        // Iterate over sub groups
        if (element.sub_groups !== undefined) {
          iterateOnGroups(element.sub_groups, $new_container);
        }

        // Add final result to page
        $start_container.append($new_container);
    });

    createBindings();
}

function iterateOnCountries(countries, $container) {
    if (countries === undefined || countries.length === 0) {
      return 0;
    }

    // Create flag container
    var $flag_container = $("<div></div>");
    $flag_container.addClass("container_flag");

    // Go through each counrty
    var totalCountries = 0;
    countries.forEach(function(element, index, array) {
        if (element._comment !== undefined) {
          return;
        }

        // Get country variables
        var letterCode = element.letter_code;
        var name = element.name;
        var contributions_past = element.contributions_past;
        var contributions_present = element.contributions_present;
        var contributions_future = element.contributions_future;
        var flag_url = "/flags/" + letterCode.toUpperCase() + ".png";

        // Build flag container
        var $flag = $("<div></div>");
        $flag.addClass("flag");
        $flag.addClass("animated");
        $flag.attr('country', letterCode);

        // Build photo
        var $photo = $("<img />");
        $photo.attr('src', flag_url);

        // Append everything
        $flag.append($photo);
        $flag_container.append($flag);

        totalCountries++;

        // Store data for later use
        _countries[letterCode] = {
            "name": name,
            "letter_code": letterCode,
            "contributions_future": contributions_future,
            "contributions_past": contributions_past,
            "contributions_present": contributions_present,
            "flag_url": flag_url
        };
    });

    // Append the flag container to the group container
    $container.append($flag_container);
    return totalCountries;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
