nodejs-news-pushnotification
============================

Node.js server to aggregate BBC and SKY top 10 news item, with push notification every one minute.

The server polls BBC and SKY RSS feed every 1 minutes and aggregates the top 10 feeds. Push notification is send to the client and the page is updated accordingly.


## Try it yourself

Clone/copy this repo to your local machine:
```sh
git clone https://github.com/dixitanubha/nodejs-news-pushnotification
```
Install the modules:
```sh
npm install
```
Run the node script
```sh
node newsAggregator.js
```

Point your browser at: [**http://localhost:3000**](http://localhost:3000)
