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
    },
    getAll: function (req, res){
        models.Video.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(videoFound){
            if(videoFound){
                return res.status(201).json({ "video": videoFound})
            }
            else{
                return res.status(404).json({ 'erreur': 'Aucune vidéo'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'erreur': 'erreur interne'})
        })
    },
    create: function (req, res){
        var titre = req.body.titre;
        var auteur = req.body.auteur;
        var url = req.body.url;

        models.Video.findOne({
            where:{titre: titre }
        })
        .then(function(videoFound){
            if(!videoFound){
                var createVideo = models.Video.create({
                    titre: titre,
                    url: url,
                    auteur: auteur
                }).then(function(createVideo){
                    if(createVideo){
                       return res.status(200).json(createVideo)
                    }
                    else{
                        return res.status(400).json({"error": "impossible de créé la vidéo"})
                    }
                })
                .catch(function(err){
                    console.log({"error": "Erreur interne contactez l'administrateur"})
                })
            }
            else{
                return res.status(400).json({'error': "La vidéo à déjà été créer"})
            }
        })
        .catch(function(err){
            console.log({"error": "Erreur interne contactez l'administrateur"})
        })
    },
    delete: function(req, res){
        var titre = req.params.titre
        models.Video.findOne({
            where:{titre: titre}
        })
        .then(function(videoFound){
            if(videoFound){
                videoFound.destroy()
                return res.status(200).json({"Message": "vidéo supprimé avec succées!"})
            }
            else{
                return res.status(400).json({"Error": "Impossible de supprimé la vidéo!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
        })
    },
    update: function(req, res){
        var id = req.body.id
        var titre = req.body.titre
        var auteur = req.body.auteur
        var url = req.body.url
        models.Video.findOne({
            where: {id: id}
        })
        .then(function(videoFound){
            if(videoFound){
                var updateVideo = models.Video.update(
                    {"titre": titre, "auteur": auteur, "url": url},
                    {where:{id: id}}
                )
                .then(function(updateVideo){
                    if(updateVideo){
                        console.log(updateVideo)
                        return res.status(200).json({"message": "Video modifier!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de modifier la vidéo!"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
                })
            }
            else{
                return res.status(404).json({"error": "Vidéo inexistante!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
        })
    }
}