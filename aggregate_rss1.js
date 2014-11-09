var  async = require('async');
var fs = require('fs');
var jsdom = require('jsdom');


//var  _ = require('underscore');
var aggregatednews;
var htmlPage;
var initHtmlPage;
var initialize;

function aggregate(rss1,rss2,init) {
     console.log("in aggregate--------");  
     initialize=init;
     //var requestBuffer = news.getRssFeed(url.parse(request.url.replace('/', '')).pathname) || [];
     
         // Close out the response.
          //return(response.end(requestBuffer.join("")));
              // Close out the response.
          //return(response.end(requestBuffer.join("")));
          var parser = new xml2js.Parser();
          parser.parseString(rss1.join(""), function (err, result) {
                //console.log(util.inspect(result, false, null))
                //console.log("result.functions: " + result["functions"]["function"][0]["$"]["id"]);
                //callback("",JSON.stringify(result));
                
                result.rss.channel[0].item = result.rss.channel[0].item.slice(0,10);
                delete result.rss.channel[0]["atom:link"];
                delete result.rss.channel[0].image;
                delete result.rss.channel[0].language;
                delete result.rss.channel[0].copyright;
                delete result.rss.channel[0].lastBuildDate;
                delete result.rss.channel[0].category;
                delete result.rss.channel[0].ttl;
                result.rss.channel[0].title = "Aggregated News - BBC and SKY";
                result.rss.channel[0].link = "test_url";
                result.rss.channel[0].description = "The latest top 10 stories from the Home section of BBC and SKY News web site.";
                
                //var itemArray = result.rss.channel[0].item;
                //console.log("items total:"+ itemArray.length);
                parser.parseString(rss2.join(""), function (err, result2) {
                     
                     result2.rss.channel[0].item = result2.rss.channel[0].item.slice(0,10);
                     result.rss.channel[0].item.push.apply(result.rss.channel[0].item, result2.rss.channel[0].item)
                     var itemArray = result.rss.channel[0].item;
                     console.log("items total---------:"+ itemArray.length);
                     var builder = new xml2js.Builder();
                     aggregatednews = builder.buildObject(result);
                     getHtml(result.rss.channel[0].item);
                     //console.log("requestBuffer----------:" + JSON.stringify(result));
                     //console.log("aggregatednews----------:" + aggregatednews);
                     //return(response.end(xml));
                });
                
            });
      

};


function getHtml(items) {
    var html = [];
    html.push("<ol>");
    var i = 0;
    items.forEach(function(entry) {
       //html.push("<li><a href='" + entry.link + "'>" + entry.title
         //   + "</a></li>");
       if (i<10)
       {
          html.push("<h3><a href='" + entry.link + "'>" + "BBC:" + entry.title
            + "</a></h3>"); 
       } else {
           html.push("<h3><a href='" + entry.link + "'>" + "SKY:" +  entry.title
            + "</a></h3>"); 
       }
       html.push("<p>" ); 
       html.push(entry.description+"</p>\n"); 

       i++;
    });
    html.push("</ol>");
    if (initialize === 1)
    {
    fs.readFile(__dirname + '/index.html', "utf-8", function(err,data){
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        } else {
            jsdom.env(data,[], function (errors, window) {
                    //res.end("Contents of a.the-link: "+window.document.getElementsByClassName("the-link")[0].textContent);
                    window.document.getElementById("rootdiv").innerHTML = html;
                    initHtmlPage = window.document.documentElement.outerHTML ;
                    
                    
            });
            
            
        }
    });
    } else {
         htmlPage = html.join("");
         
    }
    //console.log(html.join(""));
    //return (html.join(""));
}

function getAggregatedNews() {
  return(aggregatednews);
}

function getHtmlPage() {
  return(htmlPage);
}

function getInitHtmlPage() {
  return(initHtmlPage);
}


module.exports.aggregate = aggregate;
module.exports.getAggregatedNews = getAggregatedNews;
module.exports.getHtmlPage = getHtmlPage;
module.exports.getInitHtmlPage = getInitHtmlPage;
