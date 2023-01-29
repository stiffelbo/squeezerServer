const calculateProfit = ({open, sl}) => {
    let val, prcnt;
    if(open > sl){
        //loss
        prcnt = -((open - sl) / open * 100);
        val = -(open - sl);        
    }else{
        //profit
        prcnt = (sl - open) / open * 100;
        val = sl - open;
    }

    return [val, prcnt];
}

const tradeRunner = ({trade, prices, ballance}) => {
    prices.map(price => {
        if(trade.active && (price.openTime > trade.openAt)){
            //check if low is not lower than stop loss
            if(trade.sl < price.l){
                //check if should move stop loss
                if(price.candle === "MediumBody" || price.candle === "Marubozu"){
                    const newStop = price['l'] - price['atr7'];
                    if(newStop > trade.sl){
                        trade.sl = newStop;
                        trade.currentRisk = ((trade.openPrice - trade.sl) / trade.openPrice) * 100;
                    }
                }
            }else{
                //Zamykam pozycje na aktualnym stop losie
                trade.closeAt = price.closeTime;
                trade.active = false;
                const result = calculateProfit({open: trade.openPrice, sl: trade.sl});
                trade.profit = result[0];
                trade.profitPrcnt = result[1];
                const howLong = ((trade.closeAt - trade.openAt) / 1000) / 3600;
                trade.durration = howLong;
                trade.win = result[1] > 0 ? 1 : 0;
                return;
            }
        }
    });
}

module.exports = tradeRunner;