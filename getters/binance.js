const http = require('../utils/http');

module.exports = {
    get24hChange : async () => {
        const {data} = await http.get('https://api.binance.com/api/v3/ticker/24hr');
        return data;
    },
    getUsdtTickers : async () => {
        const {data} = await http.get('https://api.binance.com/api/v3/ticker/24hr');
        return data?.filter(item => {
            return (item.symbol.toLowerCase().includes('usdt') && parseFloat(item.lastPrice) > 0);   
        });
    },
    getKlines : async (symbol, interval = '4h', limit = 1000) => {
        const {data} = await http.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`);
        return data;
    }
}
