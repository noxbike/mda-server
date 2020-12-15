var models = require('../models');

module.exports = {
    /*
    * --getService--
    * Renvoi tout les services proposer par la MDA saint benoit
    * et leur description
    */
    getService: function(req, res){

        models.Services.findAll({
            attributes: ['id', 'titre', 'body', 'color', 'icon']
        })
        .then(function(servicesFound){
            if(servicesFound){
                return res.status(201).json({ servicesFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    /*
    * --getService--
    * Renvoi tout les salles proposer par la MDA saint benoit
    * et leur description
    */
    getSalle: function(req, res){
        models.Salle.findAll({
            attributes: ['id', 'titre', 'body', 'image']
        })
        .then(function(salleFound){
            if(salleFound){
                return res.status(201).json({ salleFound })
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