// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var handleLogs = function(message, isLocal, isSuccessful) {
  var messages = $('#messages');
  var classes = 'col alert rounded border border-dark ';

  // Keep messages length to 5
  if(messages.find('.row').length === 5) {
    messages.find('.row').last().remove();
  }

  // Set message styling
  classes += !isLocal ? 'alert-info' :
      (isSuccessful ? 'alert-success' : 'alert-danger');

  // Add message to the top
  messages.prepend(
      '<div class="row"><div class="' + classes + '"><span>' +
      moment().format('MMMM Do YYYY, h:mm:ss a') + ':<br />' + message +
      '</span></div></div>'
  );
};

var canABuyBeMade = function() {
  var originalWallet = $('#wallet').text();

  return parseInt(originalWallet) > 0;
};

var canASaleBeMade = function(amount, price) {
  var originalApples = $('.apple').last().find('.amount').text();

  // check sale viability

  return parseInt(originalApples) > 0;
};

var handleApples = function(isLocal, appleChange) {
  var apples = $('.apple');
  var amountOfApples = isLocal ?
      apples.last().find('.amount') :
      apples.first().find('.amount');
  var originalApples = amountOfApples.text();

  if ((parseInt(originalApples) > 0 && appleChange < 0) || (appleChange > 0)) {
    amountOfApples.text(parseInt(originalApples) + appleChange);
  }
};

var handleMoney = function(moneyChange) {
  var wallet = $('#wallet');
  var originalWallet = wallet.text();

  wallet.text(parseInt(originalWallet) + moneyChange);
};

var buyApples = function() {
  if(canABuyBeMade()) {
    handleApples(true, 1);
    handleApples(false, 1);
    handleMoney(-5);

    handleLogs('You bought an &#127823; for ' + 5 + '&#128176;!', true, true);
  } else {
    handleLogs('You cannot buy an &#127823;!', true, false);
  }
};

var sellApples = function() {
  var cost = parseInt($('#apple-price').val());

  // trigger sale event
  // pusher.trigger('free-market', 'new-sale', {
  //   "message": "Someone has sold an &#127823;!",
  //   "amountOfSale": cost
  // });

  if(canASaleBeMade(1)) {
    handleApples(true, -1);
    handleApples(false, -1);
    handleMoney(cost);

    handleLogs('You sold an &#127823; for ' + cost + '&#128176;!', true, true);
  } else {
    handleLogs('You cannot sell an &#127823;!', true, false);
  }

  // todo update valid range
};

var pusher = new Pusher('APP_KEY', {
  cluster: 'APP_CLUSTER',
  encrypted: true
});
var channel = pusher.subscribe('free-market');

channel.bind('new-shop', function(data) {
  handleLogs(data.message, false);
  handleApples(true, data.inventory.apple);
});
channel.bind('new-sale', function(data) {
  handleLogs(data.message, false);
  handleApples(true, -1);
});
