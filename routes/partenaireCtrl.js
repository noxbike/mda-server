var models = require('../models');

module.exports = {
    AffichagePartenaire: function(req, res){
        models.Partenaire.findAll({
            order:[
                ['id']
        ]
        })
        .then(function(partenaireFound){
            if(partenaireFound){
                return res.status(201).json({ partenaireFound })
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