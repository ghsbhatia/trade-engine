module.exports = {
  id: 'cryptsy',
  fee: 0.25,
  marketData: {
    url: 'https://www.cryptsy.com/api/v2/markets',
    parser: function(response, self) {
      var markets = [];
      response.data.forEach(function(data){
        var marketKey = data.id;
        var lookupKey = data.label.split('\/').join(':').toUpperCase();
        markets.push({exchange: self.id, market:lookupKey, id:marketKey});
      });
      return markets;
    }
  },
  tickerData: {
      url: 'https://www.cryptsy.com/api/v2/markets/:id/ticker',
      parser: function(response, self) {
      var buy = response.data.ask;
      var sell = response.data.bid;
      return {exchange: self.id, fee:self.fee, buy:buy, sell:sell}
    }
  }
}
