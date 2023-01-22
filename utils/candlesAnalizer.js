//functions
const hammer = ({body, upWick, lowWick, size}) => {
    const isSmallBody = size > body * 3;
    const isSmallUpperWick = upWick < body;
    const isLongLowWick = lowWick > body * 2;

    if(isSmallBody && isSmallUpperWick && isLongLowWick){
        return true;
    }else{
        return false;
    }
}

const dragonFlyDoji = ({body, upWick, lowWick, size}) => {
    const isSmallBody = body === 0 || body < size / 10;
    const isSmallUpperWick = upWick < size / 5;
    const isLongLowWick = lowWick > size * 0.80;

    if(isSmallBody && isSmallUpperWick && isLongLowWick){
        return true;
    }else{
        return false;
    }
}

const shootingStar = ({body, upWick, lowWick, size}) => {
    const isSmallBody = size > body * 3;
    const isSmallLowerWick = lowWick < body;
    const isLongUperWick = upWick > size / 2;

    if(isSmallBody && isSmallLowerWick && isLongUperWick){
        return true;
    }else{
        return false;
    }
}

const gravestoneDoji = ({body, upWick, lowWick, size}) => {
    const isSmallBody = body === 0 || body < size / 10;
    const isSmallLowerWick = lowWick < size / 5;
    const isLongUperWick = upWick > size * 0.80;

    if(isSmallBody && isSmallLowerWick && isLongUperWick){
        return true;
    }else{
        return false;
    }
}

const marubozu = ({body, size}) => {
    if(body > size * 0.91){
        return true;
    }else{
        return false;
    }
}



const checkCandle = (candle) => {

    const {o,h,l,c} = candle;

    const isRising = +o < +c;

    const size = +h - +l;
    const body = isRising ? +c - +o : +o - +c;
    const upWick = isRising ? +h - +c : +h - +o;
    const lowWick = isRising ? +o - +l : +c - +l; 

    if(marubozu({body, size})){
        console.log("Marubozu");
        return "Marubozu";
    }
    if(gravestoneDoji({body, upWick, lowWick, size})){
        console.log("Gravestone Doji");
        return "Gravestone Doji";
    }
    if(shootingStar({body, upWick, lowWick, size})){
        console.log("Shooting Star");
        return "Shooting Star";
    }
    if(dragonFlyDoji({body, upWick, lowWick, size})){
        console.log("Dragonfly Doji");
        return "Dragonfly Doji";
    }
    if(hammer({body, upWick, lowWick, size})){
        console.log("Hammer");
        return "Hammer";
    }
}


module.exports = checkCandle;