const getter = require('../getters/binance.js');

exports.getTickers = async (req, res) => {
  try {
    res.json(await getter.get24hChange());
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
};

exports.getUsdtTickers = async (req, res) => {
  try {
    res.json(await getter.getUsdtTickers());
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
};

exports.getKlines = async (req, res) => {
  try {
    const symbol = req.query.symbol;
    const interval = req.query.interval ?? null;;
    const limit = req.query.limit ?? null;
    if(symbol){
      //res.json({message: [symbol, interval, limit]});
      res.json(await getter.getKlines(symbol, interval, limit));
    }    
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
};