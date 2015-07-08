var client = require('restler');

var decorateTickerData = function(ticker, market) {
  return {exchange: ticker.exchange, market:market, fee:ticker.fee, buy:ticker.buy, sell:ticker.sell}
}

exports.markets = function(exchange, callback) {
  console.log('get exchange markets : '+exchange.marketData.url);
  client.get(exchange.marketData.url).on('complete', function(result) {
    if (result instanceof Error) {
      console.log('exchange markets service error:'+result.message);
      callback(result.message, null);
      return;
    }
    var json = typeof result == 'string' ? JSON.parse(result) : result;
    var marketData = exchange.marketData.parser(json, exchange);
    callback(null, marketData);
  });
}

exports.ticker = function(exchange, market, callback) {
  var tickerData = {};
  var tickerDataUrl = exchange.tickerData.url.replace(':id', market);
  console.log('get exchange ticker : '+tickerDataUrl);
  client.get(tickerDataUrl).on('complete', function(result) {
    if (result instanceof Error) {
      console.log('exchange ticker service error:'+result.message);
      callback(result.message, null);
      return;
    }
    var json = typeof result == 'string' ? JSON.parse(result) : result;
    var tickerData = exchange.tickerData.parser(json, exchange);
    callback(null, decorateTickerData(tickerData, market));
  });
}
