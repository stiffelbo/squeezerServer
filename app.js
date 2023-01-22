const express = require('express');
const Analizer = require('./utils/analizer');
const getter = require('./getters/binance.js');
const NodeCache = require("node-cache");


const app = express();

const cache = new NodeCache();

const timeDifference = (date1, date2) => {
    let difference = new Date(date2 - date1);
    let hours = difference.getHours();
    let minutes = difference.getMinutes().toString().padStart(2, '0');
    let seconds = difference.getSeconds().toString().padStart(2, '0');
    return `${hours ? hours : 0}:${minutes}:${seconds}`;
}

async function collectData(pairs){
    const finalData = {
    }
    let counter = 0;
    for (let index = 0; index < pairs.length; index++) {
        counter++;
        const symbol = pairs[index]['symbol'];
        if(counter === 8){
            setTimeout(async ()=>{
                const resp = await getter.getKlines(symbol);
                const analized = new Analizer(resp);
                const data = analized.emit();
                const lastValues = data[data.length-1];
                if(lastValues){
                    finalData[symbol] = {
                        currentData : lastValues,
                        candles: data,
                    }
                }
                counter = 0;
            }, 1010);
        }else{
            const resp = await getter.getKlines(symbol);
            const analized = new Analizer(resp); 
            const data = analized.emit();
            const lastValues = data[data.length-1];  
            if(lastValues){
                finalData[symbol] = {
                    currentData : lastValues,
                    candles: data,
                }
            } 
        }        
    }
    return finalData;
}


async function bot() {

    const usdtPairsDurration = 60 * 60 * 24;

    if(!cache.has('usdtPairs')){
        //get usdt tickers;
        const usdtPairs = await getter.getUsdtTickers();
        cache.set('usdtPairs', usdtPairs, usdtPairsDurration);
    }

    const usdtPairs = cache.get('usdtPairs');
    const start = new Date();
    console.log('start getting data');
    const final = await collectData([{symbol: 'BTCUSDT'}]);
    const end = new Date();
    const time = timeDifference(start, end);
    console.log('data done!', 'took me: ', time);
}

const botInterval = 1000 * 60 * 15;

app.listen(8000, ()=>{
    bot();
    setInterval(()=>{
        bot();
    }, botInterval);
});


