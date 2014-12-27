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
    var flavorsRegex = /<h3>(.*?)<\/h3>(\n|\s)+?<p>(.*?)<\/p>/g;
    var dates = [];
    var match = dateRegex.exec(data);
    var flavorData = [];
    while (match !== null) {
        dates.push(match[1]);
        match = dateRegex.exec(data);
    }
    console.log("Dates: " + dates.join("\n"));
    
    for (var dateIndex = 0; dateIndex < dates.length; dateIndex++) {
      var startLoc = data.search("<h5>" + dates[dateIndex] + "</h5>");
      var endLoc = data.length;
      if (dateIndex + 1 < dates.length) {
        endLoc = data.search("<h5>" + dates[dateIndex + 1] + "</h5>");
      }
      
      var workingData = data.substring(startLoc, endLoc);
      match = flavorsRegex.exec(workingData);
      while (match !== null) {
        console.log("Found flavor: " + match);
        flavorData.push({
          date: dates[dateIndex],
          flavor: decodeHtml(match[1]),
          description: decodeHtml(match[3])
        });
        match = flavorsRegex.exec(workingData);
      }
    }
    
    flavorList = flavorData;
  },
  function(error) {
    console.log('The ajax request failed: ' + error);
  }
);

var menu = new UI.Menu({
    sections: [{
        title: "Kopp's Flavor Forecast",
        items: buildItems()
    }]
});

menu.on('select', function(e) {
  var flavor = flavorList[e.itemIndex];
  var card = new UI.Card({
    title: flavor.date,
    subtitle: flavor.flavor,
    body: flavor.description,
    scrollable: true
  });
  card.show();
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
    var replaced = str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
        var num = parseInt(numStr, 10); // read num as normal number
        return String.fromCharCode(num);
    });
    return replaced.replace("&amp;", "&");
}