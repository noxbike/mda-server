var models = require('../models');
var confirm = require('../utils/confirmation');
var private = require('./filesCtrl');
var localhost = require('../url.json');

module.exports = {
    nouveaux: function(req, res){
        var identification_association = req.body.identification_association;
        var representant_legale = req.body.representant_legale;
        var document = req.body.file;
        var composition_bureau = req.body.composition_bureau;

        var render = composition_bureau.map(item =>
            `<div style='margin-right:30px'>
                <p><strong>fonction:</strong> ${item.fonction}</p>
                <p><strong>Nom et Prénom:</strong> ${item.NomPrenom}</p>
                <p><strong>Telephone:</strong> ${item.telephone}</p>
                <p><strong>Email:</strong> ${item.email}</p>
            </div>`);

        var realname = [];
        var attachments = [];
        document.map(item => realname.push(item.realname))
        for(let val of realname){
            let obj = {
                filename: val,
                path: `./private/${val}`
            }
            attachments.push(obj);
        }

        var message = 
        `<div style='margin-bottom:50px;font-family:sans-serif;'>
            <h1>Nouvelle demande d'adhésion</h1>
            <div>
                <div style='text-align:left;'>
                    <h2>Représentant légal</h2>
                    <div style='display: flex;'>
                        <div style='margin-right:100px;'>
                            <p><strong>Civilite:</strong> ${representant_legale.civilite}</p>
                            <p><strong>Nom:</strong> ${representant_legale.nom}</p>
                            <p><strong>Prenom:</strong> ${representant_legale.prenom}</p>
                            <p><strong>Qualité:</strong> ${representant_legale.qualite}</p>
                        </div>
                        <div>
                            <p><strong>Adresse:</strong> ${representant_legale.adresse}</p>
                            <p><strong>Telephone:</strong> ${representant_legale.telephoneAmb}</p>
                            <p><strong>Email:</strong> ${representant_legale.email}</p>
                        </div>
                    </div>
                </div>
                <div style='text-align:left;'>
                    <h2>Identification association</h2>
                    <div style='display:flex;'>
                        <div style='margin-right:30px'>
                            <p><strong>Nom de l'association:</strong> ${identification_association.nomAssociation}</p>
                            <p><strong>Date de parution au journal officiel:</strong> ${identification_association.dateParutionAuJournalOfficiel}</p>
                            <p><strong>Sigle:</strong> ${identification_association.sigle}</p>
                            <p><strong>Siret:</strong> ${identification_association.siret}</p>
                            <p><strong>Tel:</strong> ${identification_association.tel}</p>
                            <p><strong>Email de l'association:</strong>  ${identification_association.emailAssociation}</p>
                            <p><strong>Date de création:</strong> ${identification_association.dateCreation}</p>
                        </div>
                        <div style='margin-right:30px'>
                            <p><strong>Numéro RNA:</strong> ${identification_association.maldecRna}</p>
                            <p><strong>Adresse Siege Social:</strong> ${identification_association.adresseSiegeSocial}</p>
                            <p><strong>Code Ape:</strong> ${identification_association.codeApe}</p>
                            <p><strong>Agrément:</strong> ${identification_association.numAgrement}</p>
                            <p><strong>Adhérent à une struture:</strong> ${identification_association.Affiliation}</p>
                            <p><strong>Date de la dernière Assemblée Générale:</strong> ${identification_association.derniereAssembleeGenerale}</p>
                        </div>
                    </div>
                </div>
                <div style='text-align:left;'>
                    <h2>Conseil d'administration</h2>
                    <div style='display: flex;'>
                        ${render}
                    </div>
                </div>
            </div>
            <div style='margin-top:40px; width:100%'>
                <a href='http://${localhost.localhost}/admin/adherent' style='background:green;padding:4px 10px 4px 10px;font-size:20px;color:white;cursor:pointer;font-weight:600'>Voir</a>
            </div>`;

        var newRepresentantLegale = models.Representant_legale.create(representant_legale)
        .then(function(newRepresentantLegale){
            var newDocument = models.Document_association.create({Document: document, UserId: newRepresentantLegale.id})
            .then(function(newDocument){
                var newIdentificationAssociation = models.Identification_association.create({ ...identification_association, page: false, RepresentantLegaleId: newRepresentantLegale.id})
                .then(function(newIdentificationAssociation){
                    var newCompositionBureau = models.Conseil_Administration.create({ CompositionBureau: composition_bureau, UserId: newRepresentantLegale.id})
                    .then(function(newCompositionBureau){
                        confirm.send(req, res, message, 'noxbike@gmail.com', attachments);
                        return res.status(201).json({
                            'success': "Votre demande d'adhésion a bien été enregistré. Un email vous sera envoyé pour les prochaines étapes à suivre"
                        })
                    })
                })
            })
        })
        .catch(function(err){
            return res.status(500).json({ 'error': "impossible d'ajouter un représent legale "});
        })
    },
    uploadDocument: function(req, res){
        private.upload(req, res, './private');
    },
    accepter: function(req, res){
        var name = req.params.name;
        
        models.Identification_association.findOne({
            where: {nomAssociation: name }
        })
        .then(function(associationFound){
            var updateIdAssociation = models.Identification_association.update(
                {page: true},
                {where: { id: associationFound.id}}
            )
            .then(function(updateIdAssociation){
                if(updateIdAssociation){
                    var createPage = models.AssociationPage.create({
                        IdentificationAssociationId: associationFound.RepresentantLegaleId,
                        theme: associationFound.theme,
                        email: associationFound.emailAssociation,
                        lien: name,
                        photo: ['example.jpg'],
                        slogan: "Votre slogan ici...",
                        histoire: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                        map: null,
                        social: [{"link": `http://mda-saintbenoit.re/association/${associationFound.nomAssociation}`, "name": "site", "show": 1}, {"link": "https://www.twitter.com", "name": "twitter", "show": 1}, {"link": "https://www.facebook.com/", "name": "facebook", "show": 1}, {"link": "https://www.instagram.com", "name": "instagram", "show": 1}],
                        contact: {"addresse": associationFound.adresseSiegeSocial, "tel": associationFound.tel},
                        logo: 'logo-mda.png',
                        personne:[{"civilite":"Mr.", "nomEtPrenom":"Nom Prénom", "fonction":"président"}, {"civilite":"Mdm", "nomEtPrenom":"Nom Prénom", "fonction":"présidente"}],
                        mission:['mission 1', 'mission 2', 'mission 3'],
                        show: false,
                    }).then(function(createPage){
                        if(createPage){
                            models.User.findOne({
                                where: {email: associationFound.emailAssociation}
                            })
                            .then(function(userFound){
                                if(!userFound){
                                    var createUser = models.User.create({
                                        email: associationFound.emailAssociation,
                                        password: '',
                                        isAdmin: 0,
                                        status: 'Adhérent'
                                    })
                                    .then(function(createUser){
                                        return res.status(200).json({"message": "la page a bien été créé!"})
                                    })
                                    .catch(function(err){
                                        console.log({'error': err})
                                    })
                                }
                                else{
                                    return res.status(200).json({"message": "la page a bien été créé!"})
                                }
                            })
                            .catch(function(err){
                                return res.status(400).json({"error": "Erreur interne veuillez contactez l'administrateur"})
                            })
                        }
                        else{
                            return res.status(400).json({"error": "impossible de créé la page"})
                        }
                    })
                    .catch(function(err){
                        return res.status(400).json({"error": "Erreur interne veuillez contactez l'administrateur"})
                    })
                }
                else{
                    return res.status(400).json({"error": "Mise du status de compte impossible"})
                }
            })
            .catch(function(err){
                return res.status(400).json({"error": "Erreur interne veuillez contactez l'administrateur"})
            })
        })
        .catch(function(err){
            return res.status(400).json({"error": "Erreur interne veuillez contactez l'administrateur"})
        })
    },
    list: function(req, res){
        models.Identification_association.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(associationFound){
            if(associationFound){
                return res.status(201).json({ associationFound })
            }
            else{
                return res.status(404).json({ 'error': err})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    listPage: function(req, res){
        models.AssociationPage.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(pageFound){
            if(pageFound){
                return res.status(201).json({ pageFound })
            }
            else{
                return res.status(404).json({ 'error': "aucune page trouver"})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': "erreur interne veuillez contactez l'administrateur"})
        })
    },
    page: function(req, res){
        var name = req.params.name;

        models.AssociationPage.findOne({
            where: {lien: name}
        })
        .then(function(pageFound){
            if(pageFound){
                return res.status(201).json({ pageFound })
            }
            else{
                models.AssociationPage.findOne({
                    where: {email: name}
                })
                .then(function(pageFound){
                    if(pageFound){
                        return res.status(201).json({ pageFound })
                    }
                    else{
                        return res.status(404).json({'error': 'page non trouvé'})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({'error': "Erreur interne contactez l'administrateur"})
                })
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    pageVisibility: function(req, res){
        var page = req.params.lien;
        var show = req.body.show;

        models.AssociationPage.update(
            {show: show},
            {where:{lien: page}}
        ).then(function(updatePage){
            return res.status(200).json({'message': 'update réussie'})
        })
        .catch(function(err){
            return res.status(500).json({'error': "Erreur interne veuillez contactez l'administrateur"})
        })
    },
    uploadLogo: function(req, res){
        private.upload(req, res, './data/association/logo')
    },
    uploadPhoto: function(req, res){
        private.upload(req, res, './data/association/images')
    },
    newpage: function(req, res){
        var lien = req.body.lien;

        models.AssociationPage.findOne({
            where:{lien: lien}
        })
        .then(function(pageFound){
            if(!pageFound){
                var createPage = models.AssociationPage.create({
                    theme: req.body.theme,
                    lien: lien,
                    email: req.body.email,
                    photo: req.body.photos,
                    slogan: req.body.slogan,
                    histoire: req.body.histoire,
                    mission: req.body.mission,
                    personne: req.body.personne,
                    map: req.body.map,
                    social: req.body.social,
                    contact: req.body.contact,
                    logo: req.body.logo,
                    show: false,
                }).then(function(createPage){
                    if(createPage){
                        models.User.findOne({
                            where: {email: req.body.email}
                        })
                        .then(function(userFound){
                            if(!userFound){
                                var createUser = models.User.create({
                                    email: req.body.email,
                                    password: '',
                                    isAdmin: 0,
                                    status: 'Adhérent'
                                })
                                .then(function(createUser){
                                    return res.status(200).json(createPage)
                                })
                                .catch(function(err){
                                    return res.status(400).json({'error': 'impossible de créer un compte'})
                                })
                            }
                            else{
                                return res.status(200).json({"message": "la page a bien été créé!"})
                            }
                        })
                        .catch(function(err){
                            return res.status(500).json({'error': "Erreur interne contactez l'administrateur"})
                        })
                    }
                    else{
                        return res.status(400).json({"error": "impossible de créé la page"})
                    }
                })
                .catch(function(err){
                    return res.status(500).json({"error": err})
                })
            }
        })
        .catch(function(err){
            return res.status(500).json({"error": "Erreur interne contactez l'administrateur"})
        })
    },
    deletePage: function(req, res){
        var lien = req.params.lien
        models.AssociationPage.findOne({
            where:{lien: lien}
        })
        .then(function(pageFound){
            if(pageFound){
                private.deleteWithChemin(req, res, pageFound.logo ,'./data/association/logo')
                JSON.parse(pageFound.photo).map(item => private.deleteWithChemin(req, res, item ,'./data/association/images'))
                pageFound.destroy()
                return res.status(200).json({"Message": "page supprimé avec succées!"})
            }
            else{
                return res.status(400).json({"Error": "Impossible de supprimé la page!"})
            }
        })
        .catch(function(err){
            return res.status(500).json({"Error": err})
        })
    }
}