var models = require('../models');

module.exports = {
    intitule: function(req, res){
        var mission = req.body.mission;

        models.Mission.findAll({
            attributes: ['id', 'missions', 'intitule', 'lien']
        })
        .then(function(missionFound){
            if(missionFound){
                return res.status(201).json({ missionFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'Erreur interne'})
        })
    },

    missions: function(req, res){
        var mission = req.body.mission;

        models.Offre.findAll({
            where:{ mission: mission }
        })
        .then(function(missionFound){
            if(missionFound){
                return res.status(201).json({ missionFound })
            }
            else{
                return res.status(404).json({ 'error': 'Pas de mission'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'Erreur interne'})
        })
    }
}