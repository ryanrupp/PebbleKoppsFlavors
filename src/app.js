/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var ajax = require('ajax');
var flavorList = [];

ajax(
  {
    url: 'https://www.kopps.com/flavor-forecast',
    type: 'html',
    async: false
  },
  function(data) {
    var dateRegex = /<h5>(.*?\d{1,2}\/\d{1,2})<\/h5>/g;
    var dates = [];
    var match = dateRegex.exec(data);
    while (match !== null) {
        dates.push(match[1]);
        match = dateRegex.exec(data);
    }

    console.log("Dates: " + dates.join("\n"));
    var flavorsRegex = /<h3>(.*?)<\/h3>/g;
    var flavors = [];
    match = flavorsRegex.exec(data);
    while (match !== null) {
        flavors.push(match[1]);
        match = flavorsRegex.exec(data);
    }
    console.log("Flavors: " + flavors.join("\n"));
    
    var combined = [];
    var flavorIndex = 0;
    for (var index = 0; index < dates.length; index++) {
      if (index + 1 === dates.length) {
        
      }
      else {
        var currentDateLoc = data.search(dates[index]);
        var nextDateLoc = data.search(dates[index + 1]);
        for (var flavorLoc = data.search(flavors[flavorIndex]);
                nextDateLoc > flavorLoc;             
                flavorLoc = data.search(flavors[++flavorIndex])) {
             //searchFromIndex(data, currentDateLoc, nextDateLoc, flavors[++flavorIndex])
             //
            if (flavorLoc > currentDateLoc) {
              combined.push({
                date: dates[index],
                flavor: decodeHtml(flavors[flavorIndex])
              });
            }
        }
      }
    }
    
    console.log("Combined: " + combined.join("\n"));
    flavorList = combined;
  },
  function(error) {
    console.log('The ajax request failed: ' + error);
  }
);

var menu = new UI.Menu({
  sections: [{
    items: buildItems()
  }]
});

menu.on('select', function(e) {
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');
});

menu.show();

function buildItems() {
  var items = [];
  for (var i = 0; i < flavorList.length; i++) {
    console.log("adding item: " + flavorList[i].flavor);
    items.push({
      title: flavorList[i].date,
      subtitle: flavorList[i].flavor
    });
  }
  return items;
}

function decodeHtml(str) {
    return str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
}

function searchFromIndex(str, startIndex, endIndex, strToFind) {
  return str.substring(startIndex, endIndex).search(strToFind);
}