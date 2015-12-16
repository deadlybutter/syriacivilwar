var _countries = {};

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

});

function createBindings() {

    $(".flag").hover(function() {
        var $flag = $(this);
        $flag.addClass("pulse");
        $flag.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass("pulse");
        });
    }, function(){

    });

    $(".flag, .modal-host-flag").click(function() {
        var letterCode = $(this).attr("country");
        buildCountryModal(_countries[letterCode]);
    });

    $('.modal-close').click(function() {
      $('.modal-controller').css('display', 'none');
    });
}

function buildCountryModal(country) {
  var description = country.name;
  var useAnd = false;
  if (country.contributions_past != undefined) {
    description += (useAnd ? " and" : " has") + " previously contributed ";
    for (var i = 0; i < country.contributions_past.length; i++) {
      description += country.contributions_past[i];
      if (i + 1 != country.contributions_past.length) {
         description += ', ';
      }
    }
    useAnd = true;
  }

  if (country.contributions_present != undefined) {
    description += (useAnd ? " and currently contributes " : " has contributed ");
    for (var i = 0; i < country.contributions_present.length; i++) {
      description += country.contributions_present[i];
      if (i + 1 != country.contributions_present.length) {
         description += ', ';
      }
    }
    useAnd = true;
  }

  if (country.contributions_future != undefined) {
    description += (useAnd ? " and" : " has") + " pledged to contribute ";
    for (var i = 0; i < country.contributions_future.length; i++) {
      description += country.contributions_future[i];
      if (i + 1 != country.contributions_future.length) {
         description += ', ';
      }
    }
    description += " in the future";
    useAnd = true;
  }

  description += ".";

  $('.modal-controller').css('display', 'block');
  $('.modal-host-flag').attr('country', country.letterCode);
  $('.modal-host-flag').attr('src', 'flags/' + country.letter_code + '.png');
  $('.modal-description').text(description);
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

        // Nobody wants to look like there parents
        var color = (Math.random()*0xFFFFFF<<0).toString(16);
        if (element.color != undefined) {
          color = element.color;
        }
        $new_container.css('border-color', '#' + color);

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
