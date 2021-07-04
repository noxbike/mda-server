var models = require('../models');
var url = require('../utils/createUrl');
var private = require('./filesCtrl')

module.exports = {
    get: function(req, res){
        models.Article.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(articleFound){
            if(articleFound){
                var firstArticle = [];
                var articleAccueil = [];
                for(let i = 0; i < 3; i++){
                    if(i == 0){
                        firstArticle.push(articleFound[i])
                    }
                    else{
                        articleAccueil.push(articleFound[i])
                    }
                }
                return res.status(201).json({ firstArticle, articleAccueil, articleFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    getArticle: function(req, res){
        var url = req.params.url;

        models.Article.findOne({
           where:{url: url}
        })
        .then(function(articleFound){
            if(articleFound){
                return res.status(201).json({ articleFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    create: function(req, res){
        var titre = req.body.titre;

        models.Article.findOne({
            where:{ titre: titre }
        })
        .then(function(articleFound){
            if(!articleFound){
                var createArticle = models.Article.create({
                    titre: titre,
                    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has...',
                    photo: req.body.photo,
                    contenu: req.body.contenu,
                    auteur: req.body.auteur,
                    url: url.createUrl(req, res, titre),
                }).then(function(createArticle){
                    if(createArticle){
                       return res.status(200).json(createArticle)
                    }
                    else{
                        return res.status(400).json({"error": "impossible de créé l'article"})
                    }
                })
                .catch(function(err){
                    console.log({"error": err})
                })
            }
            else{
                return res.status(400).json({'error': "L'article à déjà été créer"})
            }
        })
        .catch(function(err){
            console.log({"error1":err})
        })
    },
    uploadPhoto: function(req, res){
        private.upload(req, res, './data/articles')
    },
    delete: function(req, res){
        var titre = req.params.titre
        models.Article.findOne({
            where:{titre: titre}
        })
        .then(function(articleFound){
            if(articleFound){
                private.deleteWithChemin(req, res, articleFound.photo ,'./data/articles')
                articleFound.destroy()
                return res.status(200).json({"Message": "article supprimé avec succées!"})
            }
            else{
                return res.status(400).json({"Error": "Impossible de supprimé l'article!"})
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
        var contenu = req.body.contenu
        var photo = req.body.photo
        models.Article.findOne({
            where: {id: id}
        })
        .then(function(articleFound){
            if(articleFound){
                var updateArticle = models.Article.update(
                    {"titre": titre, "auteur": auteur, "contenu": contenu, "photo": photo},
                    {where:{id: id}}
                )
                .then(function(updateArticle){
                    if(updateArticle){
                        return res.status(200).json({"message": "Article modifier!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de modifier l'article!"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
                })
            }
            else{
                return res.status(404).json({"error": "Article inexistante!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
        })
    }
}