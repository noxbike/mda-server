const models = require('../models');
const { create } = require('./articleCtrl');
const private = require('./filesCtrl');

module.exports = {
    get:function(req, res){
        models.Gallerie.findAll({
            order:[
                ['id', 'DESC']
            ]
        })
        .then(function(gallerieFound){
            if(gallerieFound){
                return res.status(201).json({ gallerieFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    getOne:function(req, res){
        models.Gallerie.findOne({
           where: {name: req.params.name}
        })
        .then(function(gallerieFound){
            if(gallerieFound){
                return res.status(201).json({ gallerieFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': "Probleme interne veuillez contactez l'administrateur"})
        })
    },
    uploadPhoto:function(req, res){
        private.upload(req, res, './data/gallerie')
    },
    createFolder: function(req, res){
        var name = req.body.titre;
        var photo = req.body.photo;
        var contenu = req.body.contenu;

        models.Gallerie.findOne({
            where: {name: name}
        })
        .then(function(folderFound){
            if(!folderFound){
                var createFolder = models.Gallerie.create({
                    name: name,
                    photo: photo,
                    contenu: contenu,
                })
                .then(function(createFolder){
                    if(createFolder){
                        return res.status(200).json(createFolder)
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de crée le dossier"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne veuillez contactez l'administrateur"})
                })
            }
            else{
                return res.status(400).json({"Error": "Ce dossier existe déjà!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Probleme interne veuillez contactez l'administrateur"})
        })
    },
    uploadInFolder: function(req, res){
        var name= req.params.dossier
        var contenu = req.body.contenu
        
        if(contenu){
            models.Gallerie.findOne({
                attributes: ['contenu','id'],
                where: {name: name}
            })
            .then(function(gallerieFound){
                var content = JSON.parse(gallerieFound.contenu)
                content.unshift(contenu)
                var updateGallerie = models.Gallerie.update(
                    {contenu: JSON.stringify(content) },
                    {where: { name: name}}
                )
                .then(function(updateGallerie){
                    if(updateGallerie){
                        return res.status(200).json({"Message": "Image ajouté avec succées!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Vous ne pouvez pas ajouté cette image"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": err})
                })
            })
         }
         else{
             return res.status(500).json({"Error": "Probleme interne veuillez contactez l'administrateur"})
         }
    },
    deleteDossier: function(req, res){
        var name = req.params.name
        models.Gallerie.findOne({
            where:{name: name}
        })
        .then(function(folderFound){
            if(folderFound){
                JSON.parse(folderFound.contenu).map(item => private.deleteWithChemin(req, res, item ,'./data/gallerie'))
                folderFound.destroy()
                return res.status(200).json({"Message": "dossier supprimé avec succées!"})
            }
            else{
                return res.status(400).json({"Error": "Impossible de supprimé la dossier!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Probleme interne veuillez contactez l'administrateur"})
        })
    },
    deletePhoto: function(req, res){
        var name = req.params.dossier
        var index = req.params.index

        models.Gallerie.findOne({
            where:{name: name}
        })
        .then(function(folderFound){
            if(folderFound){
                var content = JSON.parse(folderFound.contenu)
                private.deleteWithChemin(req, res, content[index], './data/gallerie')
                content.splice(index,1);
                var update = models.Gallerie.update(
                    {"contenu": JSON.stringify(content)},
                    {where:{name: name}}
                )
                .then(function(contentUpdate){
                    if(contentUpdate){
                        return res.status(200).json({"Message": "photo supprimé avec succées!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de supprimé la photo!"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne veuillez contactez l'administrateur"})
                })
            }
            
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne veuillez contactez l'administrateur"})
        })
    },
    update:function(req, res){
        var id = req.body.id
        var name = req.body.name
        var photo = req.body.photo
        models.Gallerie.findOne({
            where: {id: id}
        })
        .then(function(gallerieFound){
            if(gallerieFound){
                var updateGallerie = models.Gallerie.update(
                    {"name": name, "photo": photo},
                    {where:{id: id}}
                )
                .then(function(updateGallerie){
                    if(updateGallerie){
                        return res.status(200).json({"message": "Gallerie modifier!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de modifier gallerie!"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
                })
            }
            else{
                return res.status(404).json({"error": "gallerie inexistante!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
        })
        
    }
}