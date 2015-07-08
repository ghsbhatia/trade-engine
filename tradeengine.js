/*
Trade Engine - Virtual Curency Trade Recommendation Engine

A Given Trade can be executed in many ways. For e.g., to convert
DOGE to LTC using cryptsy and btc-e exchanges, following trade
combinations can be used for exchanging the currencies:

market->DOGE:LTC
  [cryptsy,132]DOGE:BTC
  [cryptsy,3]LTC:BTC

market->DOGE:LTC
  [cryptsy,132]DOGE:BTC
  [btce,ltc_btc]LTC:BTC

market->DOGE:LTC
  [cryptsy,182]DOGE:USD
  [cryptsy,1]LTC:USD

market->DOGE:LTC
  [cryptsy,182]DOGE:USD
  [btce,ltc_usd]LTC:USD

market->DOGE:LTC
  [cryptsy,311]DOGE:XRP
  [cryptsy,312]LTC:XRP

market->DOGE:LTC
  [cryptsy,135]DOGE:LTC


The following tasks are executed to compute the best rate for a given market:

1. Build Markets  - Query all the configured exchanges for market data using
                    the appropriate REST API published by the exchange.

2. Filter Markets - Keep only the markets for the given trade.

3. Price Markets  - Query configured exchanges for ticker data for trade
                    combinations for a given market.

4. Rate Markets   - Calculate net rate for each trade combination using
                    buy, sell and fee data.

Data structure used for trade combinations for a market:

[{
  market: 'DOGE:LTC',
  trades: [{ exchange: 'cryptsy', market: 'DOGE:USD', id: '182' },
           { exchange: 'btce',    market: 'LTC:USD',  id: 'ltc_usd' }]
}]
*/

var async = require("async"),
  array = require("array-extended"),
  marketBuilder = require("./app/model/marketbuilder"),
  priceBuilder = require("./app/model/pricebuilder");

var engineData = {};

var marketFilter = function(sellCurrency, buyCurrency) {
  var market = sellCurrency + ":" + buyCurrency;
  return function(data) {
    return market == data.market;
  };
};

sellFunction = function(sell, buy, fee) {
  var net = sell*(1.0-fee/100);
  return net;
}

buyFunction = function(sell, buy, fee) {
  var net = (1.0/buy)*(1.0-fee/100);
  return net;
}

/*
LTC:BTC LTC:PPC, BTC:PPC sell, buy

LTC:BTC LTC:PPC, PPC:BTC sell, sell

LTC:BTC PPC:LTC, PPC:BTC buy, sell

LTC:BTC PPC:LTC, BTC:PPC buy, buy

trade1 market[0] == trade1.market[0] : sell ? buy
trade2 market[1] == trade1.market[1] : sell ? buy
*/

var rateMarket = function(market) {
  var marketCurrencies = market.market.split(':'),
      rate = 1.0;

  market.trades.forEach(function(trade, index){
    var exchangeId = trade.exchange,
        marketId = trade.id,
        buy = trade.buy,
        sell = trade.sell,
        fee = trade.fee,
        tradeCurrencies = trade.market.split(':');

    var tradeFunction = (tradeCurrencies[index] == marketCurrencies[index])
      ? sellFunction : buyFunction;

    rate = rate*tradeFunction(sell, buy, fee);
  });

  market.rate = rate;

  return market;
}

var bestMarket = function(markets) {
  return array.max(markets,function(a,b){return a.rate-b.rate;})
}

var dumpMarkets = function(markets) {
  console.log('\nMarket Combinations\n');
  markets.forEach(function(market){
    console.log("market rate ("+market.market+") -> "+market.rate);
    market.trades.forEach(function(trade){
      console.log(("[").concat(trade.exchange).concat(",").concat(trade.id).concat(",").concat(trade.market).concat("]"));
      console.log(("buy:").concat(trade.buy).concat(",sell:").concat(trade.sell).concat(",fee:").concat(trade.fee));
    });
    console.log('\n');
  });
};

exports.trade = function(sellCurrency, buyCurrency, amount) {
  async.series([
    function(callback){
      marketBuilder.buildMarkets(function(err, markets){
        engineData.markets = markets;
        callback(err, engineData.markets);
      });
    },
    function(callback){
      var markets = engineData.markets.filter(marketFilter(sellCurrency, buyCurrency));
      engineData.markets = markets;
      callback(null, engineData.markets);
    },
    function(callback) {
      priceBuilder.priceMarkets(engineData.markets, function(err, markets) {
        engineData.markets = markets;
        callback(err, engineData.markets);
      });
    },
    function(callback){
      engineData.markets = engineData.markets.map(rateMarket);
      callback(null, engineData.markets);
    }],
    function(err, results){
      if (err != null) {
        console.log('Unable to price markets - Error :'+err);
        return;
      }
      var marketWithBestRate = bestMarket(engineData.markets),
        bestRate = marketWithBestRate.rate;
      dumpMarkets(engineData.markets);
      console.log('___________________________');
      console.log('Number of '+buyCurrency+' for '+amount+' '+sellCurrency+' (Best Rate) = '+amount*bestRate);
    });
};
