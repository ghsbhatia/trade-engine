var assert = require("assert"),
  priceBuilder = require("./../../../app/model/pricebuilder");

describe('Price Builder', function(){

  describe('markets', function(){

    it('should price a list of markets', function(done){
      var markets = [{
        market: 'DOGE:LTC',
        trades: [{ exchange: 'cryptsy', market: 'DOGE:USD', id: '182' },
           { exchange: 'btce',    market: 'LTC:USD',  id: 'ltc_usd' }]
      }]

      priceBuilder.priceMarkets(markets, function(err, pricedMarkets) {
        assert.ok(pricedMarkets.length > 0, 'atleast one priced market is expected');
        assert.ok(pricedMarkets[0].trades[0].sell > 0, 'sell price is expected');
        assert.ok(pricedMarkets[0].trades[0].buy > 0, 'buy price is expected');
        assert.ok(pricedMarkets[0].trades[0].fee > 0, 'fee is expected');
        done();
      })
    })

  })

})
