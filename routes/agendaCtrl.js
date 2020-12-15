var models = require('../models');

module.exports = {
    get: function(req, res){
        models.Agenda.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(agendaFound){
            if(agendaFound){
                return res.status(201).json({ "agendaFound": [agendaFound[0], agendaFound[1]] })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    }
}