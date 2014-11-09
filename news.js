var http = require("http");
var async = require("async");
var aggregate_rss = require("./aggregate_rss1.js");

var rssBuffer = { "BBC" : [], "SKY": [] };
var jsonBuffer = { "BBC" : [], "SKY": [] };
var intitialize = 1;

var rssHandlers = {
    "BBC": function () {
        getRSS("http://feeds.bbci.co.uk/news/rss.xml", "BBC",rssHandlerCallBack);      
    },
    "SKY": function () {
        getRSS("http://feeds.skynews.com/feeds/rss/home.xml", "SKY",rssHandlerCallBack);
    }
};

var count = 0;
var rssHandlerCallBack = function() {
  count++;
  if (count === 2)
  {
     console.log("aggregate the news feed------------");
     count=0;
     aggregate_rss.aggregate(rssBuffer["BBC"],rssBuffer["SKY"],initialize);
  }
}

var getRSS = function (url, key,callback) {
  rssBuffer = { "BBC" : [], "SKY": [] };
  http.get(url, function(res) {
    res.on("data", function(data) {
      console.log("RSS feed loading for " + key);
      rssBuffer[key].push(data);
    });
    
    res.on("end", function() {
      console.log("RSS feed loading finished for " + key);
      //console.log("RSS feed size:" + rssBuffer[key]);
      callback.call();
    });
  }).on("error", function(e) {
    console.log("Got error: " + e.message);
  });
}

function loadNews(init) {
  console.log("************loadNews*****************");
  initialize=init;
  async.forEach(Object.keys(rssHandlers), function(key, callback) { 
    rssHandlers[key]();
  }, function(err) {
        if (err) {
            throw err;
        } 
  });

  

};


function getRssFeed(key) {
  return(rssBuffer[key]);
}

function getAggregatedFeed() {
  return(aggregate_rss.getAggregatedNews());
}

function getHtmlPage() {
  return(aggregate_rss.getHtmlPage());
}

function getInitHtmlPage() {
  return(aggregate_rss.getInitHtmlPage());
}

module.exports.loadNews = loadNews;
module.exports.getRssFeed = getRssFeed;
module.exports.getAggregatedFeed = getAggregatedFeed;
module.exports.getHtmlPage = getHtmlPage;
module.exports.getInitHtmlPage = getInitHtmlPage;