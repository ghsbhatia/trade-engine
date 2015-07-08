var assert = require("assert"),
  btce = require("./../../../config/exchange/btce");

describe('btc-e Exchange', function(){

  describe('fee', function(){
    it('should charge transaction fee', function(){
    assert.ok(Object.keys(btce).indexOf('fee') != -1, 'fee is a required element');
  })
  })

  describe('parse markets', function(){

    it('should return a list of markets', function(){
      var response = {"pairs":{"btc_usd":{"fee":0.2},"btc_rur":{"fee":0.2},"btc_eur":{"fee":0.2}}},
        markets = btce.marketData.parser(response,btce);
      assert.equal(3, markets.length);
      assert.equal('BTC:RUR', markets[1].market);
      assert.equal('btc_rur', markets[1].id);
    })

  })

  describe('parse ticker', function(){

    it('should return buy/sell price', function(){
      var response = {"ltc_usd":{"last":4.0789,"buy":4.0789,"sell":4.072104}},
        ticker = btce.tickerData.parser(response,btce);
      assert.equal(4.0789, ticker.buy);
      assert.equal(4.072104, ticker.sell);
    })

  })

})