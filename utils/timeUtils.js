exports.secondsTillTomorrow = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    const secondsInADay = 24 * 60 * 60;
    const secondsUntilMidnight = (24 - currentHour - 1) * 60 * 60 + (60 - currentMinute - 1) * 60 + (60 - currentSecond);

    return secondsUntilMidnight;
}

exports.timeDifference = (date1, date2) => {
    let difference = new Date(date2 - date1);
    let hours = difference.getHours();
    let minutes = difference.getMinutes();
    let seconds = difference.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }