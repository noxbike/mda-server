var models = require('../models');
var public = require('./filesCtrl');

module.exports = {
    affichageCarousel: function(req, res){
        models.Carousel.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(carouselFound){
            if(carouselFound){
                return res.status(201).json({ carouselFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    addCarousel: function(req, res){
        var value = public.upload(req, res, './data/carousel')
    }
}