var assert = require("assert"),
  cryptsy = require("./../../../config/exchange/cryptsy");

describe('cryptsy Exchange', function(){

  describe('fee', function(){
    it('should charge transaction fee', function(){
      assert.ok(Object.keys(cryptsy).indexOf('fee') != -1, 'fee is a required element');
    })
  })

  describe('parse markets', function(){

    it('should return a list of markets', function(){
      var response = {"success":true,"data":[{"id":"489","label":"007\/BTC"},{"id":"486","label":"8BIT\/BTC"}]},
        markets = cryptsy.marketData.parser(response,cryptsy);
      assert.equal(2, markets.length);
      assert.equal('8BIT:BTC', markets[1].market);
      assert.equal('486', markets[1].id);
    })

  })

  describe('parse ticker', function(){

    it('should return buy/sell price', function(){
      var response = {"success":true,"data":{"id":"132","bid":7.1e-7,"ask":7.2e-7}},
        ticker = cryptsy.tickerData.parser(response,cryptsy);
      assert.equal(7.2e-7, ticker.buy);
      assert.equal(7.1e-7, ticker.sell);
    })

  })

})