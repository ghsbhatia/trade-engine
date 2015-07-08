var assert = require("assert"),
  marketBuilder = require("./../../../app/model/marketbuilder");

var marketFilter = function(market) {
  return function(data) {
    return market == data.market;
  };
};

var dumpMarkets = function(markets) {
  markets.forEach(function(market){
    console.log("market->"+market.market);
    market.trades.forEach(function(trade){
      console.log(("[").concat(trade.exchange).concat(",").concat(trade.id).concat("]").concat(trade.market));
    });
  });
};

describe('Market Builder', function(){

  describe('markets', function(){

    it('should return a list of markets', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        assert.ok(markets.length > 0, 'atleast one market is expected');
        done();
      })
    })

    it('should return a list of markets for DOGE:DASH', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var dogedashFilter = marketFilter("DOGE:DASH");
        var dogedashMarkets = markets.filter(dogedashFilter);
        dumpMarkets(dogedashMarkets);
        assert.ok(dogedashMarkets.length > 0, 'atleast one doge dash market is expected');
        done();
      })
    })

    it('should return a list of markets for DASH:DOGE', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var dashdogeFilter = marketFilter("DASH:DOGE");
        var dashdogeMarkets = markets.filter(dashdogeFilter);
        dumpMarkets(dashdogeMarkets);
        assert.ok(dashdogeMarkets.length > 0, 'atleast one dash doge market is expected');
        done();
      })
    })

    it('should return a list of markets for DOGE:PPC', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var dogeppcFilter = marketFilter("DOGE:PPC");
        var dogeppcMarkets = markets.filter(dogeppcFilter);
        dumpMarkets(dogeppcMarkets);
        assert.ok(dogeppcMarkets.length > 0, 'atleast one doge ppc market is expected');
        done();
      })
    })

    it('should return a list of markets for PPC:DOGE', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var ppcdogeFilter = marketFilter("PPC:DOGE");
        var ppcdogeMarkets = markets.filter(ppcdogeFilter);
        dumpMarkets(ppcdogeMarkets);
        assert.ok(ppcdogeMarkets.length > 0, 'atleast one ppc doge market is expected');
        done();
      })
    })

    it('should return a list of markets for DOGE:LTC', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var dogeltcFilter = marketFilter("DOGE:LTC");
        var dogeltcMarkets = markets.filter(dogeltcFilter);
        dumpMarkets(dogeltcMarkets);
        assert.ok(dogeltcMarkets.length > 0, 'atleast one doge ltc market is expected');
        done();
      })
    })

    it('should return a list of markets for LTC:DOGE', function(done){
      marketBuilder.buildMarkets(function(err, markets) {
        var ltcdogeFilter = marketFilter("LTC:DOGE");
        var ltcdogeMarkets = markets.filter(ltcdogeFilter);
        dumpMarkets(ltcdogeMarkets);
        assert.ok(ltcdogeMarkets.length > 0, 'atleast one ltc doge market is expected');
        done();
      })
    })

  })

})

