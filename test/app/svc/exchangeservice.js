var assert = require("assert"),
  async = require("async"),
  btce = require("./../../../config/exchange/btce"),
  cryptsy = require("./../../../config/exchange/cryptsy"),
  service = require("./../../../app/svc/exchangeservice");

describe('Exchange Service', function(){

  describe('markets', function(){

    it('should return a list of markets', function(done){
      service.markets(btce, function(err, marketData) {
        assert.ok(marketData.length > 0, 'atleast one market is expected');
        done();
      })
    })

  })

  describe('ticker', function(){

    it('should return ticker for a given market', function(done){
      service.ticker(btce, 'ltc_usd', function(err, tickerData) {
        assert.ok(tickerData.sell > 0, 'sell price is expected');
        assert.ok(tickerData.buy > 0, 'buy price is expected');
        done();
      })
    })

    it('should return market in ticker', function(done){
      service.ticker(btce, 'ltc_usd', function(err, tickerData) {
        assert.equal('ltc_usd', tickerData.market, 'market is expected');
        done();
      })
    })

    it('should return exchange in ticker', function(done){
      service.ticker(btce, 'ltc_usd', function(err, tickerData) {
        assert.equal('btce', tickerData.exchange, 'exchange is expected');
        done();
      })
    })

  })

})

describe('Async Market Service', function(){

  it('should retrive markets in sequence for given exchanges', function(done){

    this.timeout(5000);

    var btceCallback = function(err, m) {
      //console.log(m);
    };

    var cryptsyCallback = function(err, m) {
      //console.log(m);
    };

    var createMarketSeriesCallback = function(marketCallback, seriesCallback) {
      return function(err, result) {
        marketCallback(err, result);
        seriesCallback(err, result);
      }
    };

    async.series([
      function(callback){
        service.markets(btce, createMarketSeriesCallback(btceCallback, callback));
      },
      function(callback){
        service.markets(cryptsy, createMarketSeriesCallback(cryptsyCallback, callback));
      }],
      function(err, results){
        //console.log(results);
        assert.equal(2, results.length, '2 elements expected in results array');
        done();
      });

  })

  it('should concat markets for given exchanges', function(done){

    async.concat([btce,cryptsy], service.markets, function(err, marketData){
      // marketData is consolidated list of markets from all the given exchanges
      assert.ok(marketData.length > 0, 'List of markets expected');
      //console.log(marketData);
      done();
    });

  })

})

describe('Async Ticker Service', function(){

  describe('sequence of tickers', function(){

    it('should execute tasks in parallel', function(done){

      this.timeout(5000);

      var createMarketSeriesCallback = function(marketCallback, seriesCallback) {
        return function(err, result) {
          marketCallback(err, result);
          seriesCallback(err, result);
        }
      }

      var createTickerTask = function(exchange, market) {
        return function(callback) {
          service.ticker(exchange, market, createMarketSeriesCallback(tickerCallback, callback));
        }
      }

      var tickerCallback = function(err, m) {
        console.log('SELL '+m.sell+' : BUY '+m.buy);
      }

      trades = [{exchange:cryptsy, market:'132'},{exchange:btce, market:'ltc_usd'}];

      var tickerTasks = [];

      trades.forEach(function(trade){
        var tickerTask = createTickerTask(trade.exchange, trade.market);
        tickerTasks.push(tickerTask);
      });

      async.parallel(tickerTasks, function(error, results) {
        done();
      });

    });

  });

});



