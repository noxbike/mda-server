var models = require('../models');

module.exports = {
   createUrl: function(req, res, name){
       if(name){
            let record = '';
                for(let i = 0; i < name.length; i++){
                    if(name[i] === '%'){
                        record += '-pour-cent';
                    }
                    else if(name[i] === '?'){
                        record += '';
                    }
                    else if(name[i] === ' '){
                        record += '-';
                    }
                    else{
                        record += name[i];
                    }
                }

                return record;
        }
        else{
            console.log(name)
        }
    }
}