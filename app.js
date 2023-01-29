const express = require('express');
const Analizer = require('./utils/analizer');
const getter = require('./getters/binance.js');
const NodeCache = require("node-cache");
const fs = require('fs');

const XLSX = require('xlsx');

function saveAsXLS(data, name) {
    // create a new workbook
    const wb = XLSX.utils.book_new();
  
    // convert the data array to a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
  
    // add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Trades');
  
    // write the workbook to a file
    XLSX.writeFile(wb, `${name}.xls`);
  }

const finalToTable = obj => {
    const result = [];
    const keys = Object.keys(obj);
    keys.map(key => {
        const arr = obj[key];
        if(arr){
            arr.map(item => {
                result.push({...item, ticker : key});
            });
        }
    });
    return result;
}

const summary = arr => {
    let losses = 0;
    let wins = 0;
    let result = 0;
    let openTrades = 0;
    let initialRisk = {
        win: [],
        loss: [],
    }
    arr?.map(trade => {
        if(trade.profitPrcnt > 0){
            wins++;
            initialRisk.win.push(trade.initialRisk);
        }else{
            losses++;
            initialRisk.loss.push(trade.initialRisk);
        }
        result = result + trade.profitPrcnt;
        if(trade.active === true){
            openTrades++;
        }
    });

    const avgWinInitialRisk = initialRisk.win.reduce((a, b) => a + b) / initialRisk.win.length;
    const avgLossInitialRisk = initialRisk.loss.reduce((a, b) => a + b) / initialRisk.loss.length;
    const maxWinInitialRisk = Math.max(...initialRisk.win);
    const maxLossInitialRisk = Math.max(...initialRisk.loss);

    return {result, trades: arr.length, wins, losses, openTrades, avgLossInitialRisk, avgWinInitialRisk, maxLossInitialRisk, maxWinInitialRisk}

}

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
    const ballance = {
        initial : 1000,
        current : 0,
        onTrade : 0,
        activeRisk : 0,
        total: 0,
    }

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
                finalData[symbol] = data;
                /*
                const lastValues = data[data.length-1];
                if(lastValues){
                    finalData[symbol] = {
                        currentData : lastValues,
                        candles: data,
                    }
                }
                */
                counter = 0;
            }, 1010);
        }else{
            const resp = await getter.getKlines(symbol);
            const analized = new Analizer(resp); 
            const data = analized.emit();
            finalData[symbol] = data;
                /*
                const lastValues = data[data.length-1];
                if(lastValues){
                    finalData[symbol] = {
                        currentData : lastValues,
                        candles: data,
                    }
                }
                */
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
    //const final = await collectData([{symbol: 'BTCUSDT'}]);
    const final = await collectData(usdtPairs);
    const end = new Date();
    const time = timeDifference(start, end);
    const table = finalToTable(final);
    const date = new Date();
    const filename = date.toLocaleDateString();
    saveAsXLS(table, filename);
    console.log('data done!', 'took me: ', time);
    console.log(summary(table));
}

const botInterval = 1000 * 60 * 15;

app.listen(8000, ()=>{
    bot();
    setInterval(()=>{
        bot();
    }, botInterval);
});


