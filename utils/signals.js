const signals = (candle, settings) => {

    const trade = {
        type: 'Long',
        signal: '',
        openPrice : 0,
        sl : 0,
        initialRisk: 0,
        currentRisk : 0,
        active: false,
        signalAt : null,
        openAt : null,
        closeAt : null,
        profit : 0,
        profitPrcnt : 0,
    }
    const mas = candle[`sma${settings.ma[2]}`];
    const mam = candle[`sma${settings.ma[1]}`];
    const maf = candle[`sma${settings.ma[0]}`];

    const isMarubozuOrMediumBody = candle['candle'] === 'Marubozu' || candle['candle'] === 'MediumBody';
    const isCrossingMas = candle['o'] < mas && candle['c'] > mas;
    const averagesLayout = mas > mam && mas > maf;
    
    //"CrossMas"
    if(isMarubozuOrMediumBody && isCrossingMas && averagesLayout){

        //check if can open at risk of < 3%
        const sl = candle['l'] - (candle['atr7'] / 2);
        const risk = ((candle['c'] - sl) / candle['c']) * 100;

        if(risk < 7){
            trade.signal = "CrossMas";
            trade.openPrice = candle['c'];
            trade.sl = sl;
            trade.initialRisk = risk;
            trade.currentRisk = trade.initialRisk;
            trade.signalAt = candle['closeTime'];
            trade.openAt = candle['closeTime'];
            trade.active = true;
            trade.candle = JSON.stringify(candle);
            return trade;
        }else{
            return null;
        }
        
    }else{
        return null;
    }

    /*

    //Marubozu on up trend
    if(maf > mam && mam > mas && candle['candle'] === 'Marubozu' && candle['o'] < candle['c']){
        //check if can open at risk of < 3%
        const sl = candle['l'] - (candle['atr7'] / 2);
        const risk = ((candle['c'] - sl) / candle['c']) * 100;

        if(risk < 7){
            trade.signal = "Marubozu on uptrend";
            trade.openPrice = candle['c'];
            trade.sl = sl;
            trade.initialRisk = risk;
            trade.currentRisk = trade.initialRisk;
            trade.signalAt = candle['closeTime'];
            trade.openAt = candle['closeTime'];
            trade.active = true;
            return trade;
        }else{
            console.log('Risk to big: ', risk);
            return null;
        }
    }
    */

}


module.exports = signals;