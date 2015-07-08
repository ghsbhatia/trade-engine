var async = require("async"),
  array = require("array-extended");
  exchangeConfig = require("./../../config/exchangeconfig"),
  exchangeSvc = require("./../../app/svc/exchangeservice");

var markets = [];

// Filter for supported currency.
// CNC:BTC is not a valid market as none of the currencies in pair is supported.
// LTC:BTC is a valid market as LTC is a supported currency.
var currencyFilter = function(data) {
  var currencies = data.market.split(':');
  return exchangeConfig.currencies.indexOf(currencies[0]) != -1 || exchangeConfig.currencies.indexOf(currencies[1]) != -1;
}

// Filter a pair of markets that have only one common currency
// DOGE:BTC, BTC:PPC is such a pair.
//
// ['DOGE','BTC'] - ['BTC','PPC']  = ['DOGE']
// ['DOGE','BTC'] - ['LTC','EUR']  = ['DOGE','BTC']
// ['DOGE','BTC'] - ['BTC','DOGE'] = []
// DOGE:BTC, BTC:PPC is such a pair.
var marketFilter = function(data) {
  var market1 = data[0].market.split(':');
  var market2 = data[1].market.split(':');
  return array.difference(market1, market2).length == 1;
}

// Create a market from market combination
// DOGE:PPC can be created from pair DOGE:BTC, BTC:PPC.
//
// ['DOGE','BTC'] union     ['BTC','PPC']  = ['DOGE','BTC','PPC']
// ['DOGE','BTC'] intersect ['BTC','PPC']  = ['BTC']
// ['DOGE','BTC','PPC'] - ['BTC'] = ['DOGE','PPC']
var marketMaker = function(data) {
  var market1 = data[0].market.split(':');
  var market2 = data[1].market.split(':');

  market = array.difference(array.union(market1, market2), array.intersect(market1, market2));

  return {market: market.join(':'), trades: data};
}

// Create a reverse market to support both sell and buy
// DOGE:BTC is reversed as BTC:DOGE
var reverseMarket = function(market) {
    var symbols = market.split(':');
    return symbols[1]+":"+symbols[0];
}

exports.buildMarkets = function(callback) {

  async.concat(exchangeConfig.exchanges, exchangeSvc.markets, function(err, marketData){

    // marketData is consolidated list of markets from all the given exchanges

    // Filter out markets that do not have a supported currency.
    // CNC:BTC is not a valid market as none of the currencies in pair is supported.
    // LTC:BTC is a valid market as LTC is a supported currency.
    var marketDataForSupportedCurencies = marketData.filter(currencyFilter);

    // Make a pair of markets that have only one common currency to find market combinations
    // DOGE:BTC, BTC:PPC is such a pair.
    var marketCombinations = array.permutations(marketDataForSupportedCurencies,2).filter(marketFilter);

    // Map market combination to market
    // DOGE:BTC, BTC:PPC combination maps to DOGE:PPC market
    var markets = marketCombinations.map(marketMaker);

    // Add markets supported within a single exchange.
    marketDataForSupportedCurencies.forEach(function(data) {
      markets.push({market: data.market, trades: [data]});
      markets.push({market: reverseMarket(data.market), trades: [data]});
    });

    callback(err, markets);

  });

};