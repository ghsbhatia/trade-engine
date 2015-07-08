var btce = require("./exchange/btce"),
    cryptsy = require("./exchange/cryptsy");

var exchanges = [btce, cryptsy];

var getExchange = function(id) {
  for (var i = 0; i < exchanges.length; i++) {
    if (exchanges[i].id == id) return exchanges[i];
  }
  return null;
};

module.exports = {
  markets: ['DOGE:DASH', 'DOGE:PPC', 'DOGE:LTC'],
  currencies: ['DOGE','DASH','PPC','LTC'],
  exchanges: exchanges,
  getExchange: getExchange
};
