var http = require("http");
var url  = require("url");
xml2js = require("xml2js");
news = require("./news.js");
//var initialize=1;

news.loadNews(1);
//setInterval(news.loadNews, 60000);
var intervalId = setInterval( function() { news.loadNews(1); }, 600000 );


var app = http.createServer(
	function( request, response ){

        //var aggregated_rss_news = news.getAggregatedFeed();
        var aggregated_rss_news_init = news.getInitHtmlPage();
        //initialize=0;
        news.loadNews(0);
    
    	// REQUEST HANDLER
		request.on(
			"data",
			function( chunk ){
			}
		);

		// REQUEST END HANDLER
		request.on(
			"end",
			function(){
			
        if (aggregated_rss_news_init.length) {
          response.writeHead(
            "200",
            "OK",
            { "content-type": "text/html" }
          );

          // Close out the response.
          return(response.end(aggregated_rss_news_init));
        }
        else {
          response.writeHead(
              "404",
              "Page Not Found",
              { "content-type": "text/html" }
            );

          // Close out the response.
          return(response.end(aggregated_rss_news_init));
        }
			}
		);
	}
);

var io = require('socket.io')(app);


io.on('connection', function(socket) {
    console.log("here---socket");
    clearInterval(intervalId);
    setInterval(function() {
        //news.getUpdatedNewsList();
        //console.log('Emitted: ' + timestamp);
        //setInterval(news.loadNews, 600000);
        //setInterval( function() { news.loadNews(1); }, 500 );
        var aggregated_rss_news = news.getHtmlPage();
        news.loadNews(0);
        console.log("-----------before emit---------");
        socket.emit('timer',aggregated_rss_news);
    },60000);
    socket.on('submit', function(data){
        console.log('Submitted: ' + data);
    });
});


app.listen( 3000 );
console.log( "Aggregate news server listening on port 3000" );
