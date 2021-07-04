var models = require('../models');
var public = require('./filesCtrl');
var private = require('./filesCtrl');

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
    upload: function(req, res){
        private.upload(req, res, './data/carousel')
    },
    add: function(req, res){
        var name = req.body.photo;

        var createCarousel = models.Carousel.create({
            images: name,
            caption:'<p></p>'
        })
        .then(function (createCarousel){
            return res.status(200).json({ name })
        })
        .catch(function(err){
            return res.status(500).json({'error': "Erreur interne veuillez contactez l'admin"})
        })
    },
    delete: function(req,res){
        var name = req.params.photo;

        models.Carousel.findOne({
            where:{images: name}
        })
        .then(function(photoFound){
            if(photoFound){
                private.deleteWithChemin(req, res, name, './data/carousel/');
                photoFound.destroy()
                return res.status(200).json({'message': "Image supprimer !"})
            }
            else{
                return res.status(404).json({'error': "Image inexistant dans la base de donnée"})
            }
        })
        .catch(function(err){
            return res.status(500).json({'error': "Erreur interne contactez l'administrateur"})
        })
    },
    reOrder: function(req,res){
        var carousel = req.body.carousel
        for(let value of carousel){
            var update = models.Carousel.update(
                {"images": value.images},
                {where:{id: value.id}}
            )
        }
        return res.status(200).json({"message": "carousel mis à jour!"})
    }
}