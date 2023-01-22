const checkCandle = require('./candlesAnalizer');

const defaultSettings = {
    ma: [31, 81, 200],
    volMa: [31],
    doncTenk : [31, 81, 200],
    low: [31, 81, 200],
    high: [31, 81, 200],
    atr: [31, 81, 200],
    ph: [26],
    pl: [26]
}

//Overall market analize.

class Analizer{
    constructor(data, settings = defaultSettings){
        const comp = this;
        comp.data = data;
        comp.pivots = [];
        comp.settings = settings;
        comp.initActions();
        comp.emit();
    }

    convertData(){
        const comp = this;
        comp.data = comp.data.map(item => {
            const elem = {
                openTime : item[0],
                o : item[1],
                h : item[2],
                l : item[3],
                c : item[4],
                vol : item[5],
                qVol : item[7],
                trades : item[8],
            };
            return elem;
        });
    }

    candles(prices){
        for (let index = 0; index < prices.length; index++) {        
            prices[index]['candle'] = checkCandle(prices[index]);
        }
    }

    ma(prices, window, keyIndex = 'c', lab = 'sma'){
        const label = `${lab}${window}`;
        if (!prices || prices.length < window) {
            return [];
        }

        for (let index = 0; index < prices.length; index++) {
            if(index < window){
                prices[index][label] = null;
            }else{
                const windowSlice = prices.slice(index - window, index);
                const sum = windowSlice.reduce((sum, curr) => sum + +curr[keyIndex], 0);
                const avg = sum / window;
                prices[index][label] = avg;
            }        
        }
        return prices;
    }

    doncTenk(prices, window){
        const labellow = `l${window}`;
        const labelhigh = `h${window}`;
        const labeltenk = `tenk${window}`;
        if (!prices || prices.length < window) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {            
            if(index < window){
            }else{
                const windowSlice = prices.slice(index - window, index);
                const valuesHigh = [...windowSlice.map(item => +item['h'])];
                const valuesLow = [...windowSlice.map(item => +item['l'])];
                prices[index][labelhigh] = Math.max(...valuesHigh);
                prices[index][labellow] = Math.min(...valuesLow);
                prices[index][labeltenk] = (prices[index][labelhigh] + prices[index][labellow]) / 2;
            }        
        }
        return prices;
    }

    low(prices, window, keyIndex = 'l', lab = 'min'){
        const label = `${lab}${window}`;
        if (!prices || prices.length < window) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {
            if(index < window){
                prices[index][label] = null;
            }else{
                const windowSlice = prices.slice(index - window, index);
                prices[index][label] = Math.min(...windowSlice.map(item => +item[keyIndex]));
            }        
        }
        return prices;
    }

    high(prices, window, keyIndex = 'h', lab = 'max'){
        const label = `${lab}${window}`;
        if (!prices || prices.length < window) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {            
            if(index < window){
            }else{
                const windowSlice = prices.slice(index - window, index);
                const values = [...windowSlice.map(item => +item[keyIndex])];
                prices[index][label] = Math.max(...values);
            }        
        }
        return prices;
    }

    atr(prices, window, lab = 'atr'){
        const label = `${lab}${window}`;
        if (!prices || prices.length < window) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {
            if(index < window){
                prices[index][label] = null;
            }else{
                const windowSlice = prices.slice(index - window, index);
                const sum = windowSlice.reduce((sum, curr) => sum + (+curr['h'] - +curr['l']), 0);
                const avg = sum / window;
                prices[index][label] = avg;
            }        
        }
        return prices;
    }

    ph(prices, window, lab = 'ph'){
        const label = `${lab}${window}`;
        const pivots = [];
        if (!prices || prices.length < window * 2 + 1) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {
            if(index < window && index > prices.length - window){
                prices[index][label] = false;
            }else{
                const currentHigh = prices[index]['h'];
                const windowSlice = prices.slice(index - window, index + window);
                const values = [...windowSlice.map(item => +item['h'])];
                const windowHigh = Math.max(...values);
                prices[index][label] = currentHigh > windowHigh;
                if(prices[index][label]){
                    pivots.push(prices[index]);
                }
            }        
        }
        return {prices, pivots};
    }

    pl(prices, window, lab = 'pl'){
        const label = `${lab}${window}`;
        const pivots = [];
        if (!prices || prices.length < window * 2 + 1) {
            return [];
        }
        for (let index = 0; index < prices.length; index++) {
            if(index < window && index > prices.length - window){
                prices[index][label] = false;
            }else{
                const currentLow = prices[index]['l'];
                const windowSlice = prices.slice(index - window, index + window);
                const values = [...windowSlice.map(item => +item['l'])];
                const windowLow = Math.min(...values);
                prices[index][label] = currentLow < windowLow;
                if(prices[index][label]){
                    pivots.push(prices[index]);
                }
            }        
        }
        return {prices, pivots};
    }

    findEvents(prices){
        //
    }

    initActions(){
        const comp = this;
        this.convertData();
        this.candles(comp.data);
        this.settings.ma.map(len => {
            comp.data = this.ma(comp.data, len, 'c');
        });
        this.settings.volMa.map(len => {
            comp.data = this.ma(comp.data, len, 'qVol', 'volSma');
        });
        /*
        this.settings.low.map(len => {
            comp.data = this.low(comp.data, len, 'l', 'min');
        });
        this.settings.high.map(len => {
            comp.data = this.high(comp.data, len, 'h', 'max');
        });
        */
        this.settings.doncTenk.map(len => {
            comp.data = this.doncTenk(comp.data, len);
        });
        this.settings.atr.map(len => {
            comp.data = this.atr(comp.data, len);
        });
        this.settings.ph.map(len => {
            const result = this.ph(comp.data, len);
            comp.data = result.prices;
            comp.pivots = [...comp.pivots, ...result.pivots];
        });
        this.settings.pl.map(len => {
            const result = this.pl(comp.data, len);
            comp.data = result.prices;
            comp.pivots = [...comp.pivots, ...result.pivots];
        });
    }

    emit(){
        return this.pivots;
    }
}


module.exports = Analizer;