var moment = require('moment');
moment.locale('fr')

module.exports = {
    convert: function(date){
        let result = moment(date).format('dddd Do MMMM  YYYY, HH:mm');
        return result
    }
}