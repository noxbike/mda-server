var models = require('../models');
var private = require('./filesCtrl');
var url = require('../utils/createUrl')

module.exports = {
    getForAccueil: function(req, res){
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
            return res.status(500).json({ 'error': "Erreur interne contactez l'administrateur"})
        })
    },
    get: function(req,res){
        models.Agenda.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(agendaFound){
            if(agendaFound){
                return res.status(201).json({ agendaFound})
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': "Erreur interne contactez l'administrateur"})
        })
    },
    getAgenda: function(req, res){
        var url = req.params.url;

        models.Agenda.findOne({
           where:{url: url}
        })
        .then(function(agendaFound){
            if(agendaFound){
                return res.status(201).json({ agendaFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': "Erreur interne contactez l'administrateur"})
        })
    },
    create: function(req, res){
        var titre = req.body.titre;

        models.Agenda.findOne({
            where:{titre: titre }
        })
        .then(function(agendaFound){
            if(!agendaFound){
                var createAgenda = models.Agenda.create({
                    titre: titre,
                    photo: req.body.photo,
                    ou: req.body.ou,
                    au: req.body.au,
                    du: req.body.du,
                    contenu: req.body.contenu,
                    auteur: req.body.auteur,
                    url: url.createUrl(req, res, titre),
                }).then(function(createAgenda){
                    if(createAgenda){
                       return res.status(200).json(createAgenda)
                    }
                    else{
                        return res.status(400).json({"error": "impossible de créé l'agenda"})
                    }
                })
                .catch(function(err){
                    console.log({"error": err})
                })
            }
            else{
                return res.status(400).json({'error': "L'agenda à déjà été créer"})
            }
        })
        .catch(function(err){
            console.log({"error": "Erreur interne contactez l'administrateur"})
        })
    },
    uploadPhoto: function(req, res){
        private.upload(req, res, './data/evenement')
    },
    delete: function(req, res){
        var titre = req.params.titre
        models.Agenda.findOne({
            where:{titre: titre}
        })
        .then(function(eventFound){
            if(eventFound){
                private.deleteWithChemin(req, res, eventFound.photo ,'./data/evenement')
                eventFound.destroy()
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
        var du = req.body.du
        var ou = req.body.ou
        var au = req.body.au
        models.Agenda.findOne({
            where: {id: id}
        })
        .then(function(agendaFound){
            if(agendaFound){
                var updateAgenda = models.Agenda.update(
                    {"titre": titre, "auteur": auteur, "contenu": contenu, "photo": photo, "du": du, "au": au, "ou": ou},
                    {where:{id: id}}
                )
                .then(function(updateAgenda){
                    if(updateAgenda){
                        return res.status(200).json({"message": "Agenda modifier!"})
                    }
                    else{
                        return res.status(400).json({"Error": "Impossible de modifier l'agenda!"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
                })
            }
            else{
                return res.status(404).json({"error": "Agenda inexistante!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": "Erreur interne contactez l'administrateur"})
        })
    }
}