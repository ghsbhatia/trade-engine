var async = require("async"),
  array = require("array-extended");
  exchangeConfig = require("./../../config/exchangeconfig"),
  exchangeSvc = require("./../../app/svc/exchangeservice");

var tickerMap = [];

var priceDecorator = function(markets) {
  markets.forEach(function(market){
    market.trades.forEach(function(trade){
      var ticker = tickerMap[trade.exchange+':'+trade.id];
      trade.buy = ticker.buy;
      trade.sell = ticker.sell;
      trade.fee = ticker.fee;
    });
  });
  return markets;
};

var createTickerTask = function(exchange, market) {
  return function(callback) {
    exchangeSvc.ticker(exchangeConfig.getExchange(exchange), market, createTickerCallback(callback));
  }
}

var createTickerCallback = function(callback) {
  return function(err, ticker) {
    var tickerKey = ticker.exchange + ':' + ticker.market;
    tickerMap[tickerKey] = ticker;
    callback(err, ticker);
  }
}

exports.priceMarkets = function(markets, callback) {

  var tickerTasks = [];

  markets.forEach(function(market){
    market.trades.forEach(function(trade){
      var tickerTask = createTickerTask(trade.exchange, trade.id);
      tickerTasks.push(tickerTask);
    });
  });

  async.parallel(tickerTasks, function(err, priceTickers) {
    var pricedMarkets = priceDecorator(markets);
    callback(err, pricedMarkets);
  });

}

