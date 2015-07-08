module.exports = {
  id: 'btce',
  fee: 0.2,
  marketData: {
    url: 'https://btc-e.com/api/3/info',
    parser: function(response, self) {
      var markets = [];
      Object.keys(response.pairs).forEach(function(marketKey){
        var lookupKey = marketKey.split('_').join(':').toUpperCase();
        markets.push({exchange:self.id, market:lookupKey, id:marketKey});
      });
      return markets;
    }
  },
  tickerData: {
    url: 'https://btc-e.com/api/3/ticker/:id',
    parser: function(response, self) {
      var marketKey = Object.keys(response)[0];
      var buy = response[marketKey].buy;
      var sell = response[marketKey].sell;
      return {exchange:self.id, fee:self.fee, buy: buy, sell: sell}
    }
  }
}
