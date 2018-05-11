var Pusher = require('pusher');
var pusher = new Pusher({
  appId: 'APP_ID',
  key: 'APP_KEY',
  secret: 'APP_SECRET',
  cluster: 'APP_CLUSTER',
  encrypted: true
});

var fs = require('fs');
var path = require('path');

exports.get = function(event, context, callback) {
  var contents = fs.readFileSync(`public${path.sep}index.html`);
  var result = {
    statusCode: 200,
    body: contents.toString(),
    headers: {'content-type': 'text/html'}
  };

  console.log("Hello!");

  pusher.trigger('free-market', 'new-shop', {
    "message": "A new shop has joined the market!",
    "inventory": {
      "apple": 10
    }
  });

  callback(null, result);
};
