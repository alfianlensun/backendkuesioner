const moment = require('moment')

const timeDiff = (startTime, endTime) => {
    let diff = ''
    let jam = moment(endTime).diff(moment(startTime), 'hour')
    let menit = moment(endTime).diff(moment(startTime), 'minutes')-jam*60*60/60
    let detik = moment(endTime).diff(moment(startTime), 'seconds')-(jam*60*60)-(menit*60)
    
    return {
        jam,
        menit,
        detik
    }
}

module.exports = {
    timeDiff
}