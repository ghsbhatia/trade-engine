var assert = require("assert"),
  exchangeConfig = require("../../config/exchangeconfig");

describe('Exchange Configuration', function(){

  describe('markets', function(){
    it('should return a list of markets', function(){
      assert.ok(exchangeConfig.markets.length >= 1, 'atleast one market is required');
    })
  })

  describe('currencies', function(){
    it('should return a list of currencies', function(){
      assert.ok(exchangeConfig.currencies.length >= 2, 'atleast two currencies required');
    })
  })

  describe('exchanges', function(){

    it('should have btc-e', function(){
      var exchanges = exchangeConfig.exchanges.map(function(exchange) {
        return exchange.id;
      });
      assert.ok(exchanges.indexOf('btce') != -1, 'btc-e exchange is required');
    })

    it('should have cryptsy', function(){
      var exchanges = exchangeConfig.exchanges.map(function(exchange) {
        return exchange.id;
      });
      assert.ok(exchanges.indexOf('cryptsy') != -1, 'cryptsy exchange is required');
    })

    it('should return exchange for given id', function(){
      var cryptsy = exchangeConfig.getExchange('cryptsy');
      assert.ok(cryptsy != null, 'cryptsy exchange is required');
      assert.equal('cryptsy', cryptsy.id, 'exchange with id cryptsy is required');
    })
  })

})