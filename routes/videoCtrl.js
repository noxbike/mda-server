const models = require('../models');

module.exports = {
    get: function (req, res){
        models.Video.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(videoFound){
            if(videoFound){
                return res.status(201).json({ "video": videoFound[0] })
            }
            else{
                return res.status(404).json({ 'erreur': 'Aucune vidéo'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'erreur': 'erreur interne'})
        })
    }
}