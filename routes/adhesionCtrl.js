var models = require('../models');
var confirm = require('../utils/confirmation');
var private = require('./filesCtrl');

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
            </div>`;

        var newRepresentantLegale = models.Representant_legale.create(representant_legale)
        .then(function(newRepresentantLegale){
            var newDocument = models.Document_association.create({Document: document, UserId: newRepresentantLegale.id})
            .then(function(newDocument){
                var newIdentificationAssociation = models.Identification_association.create({ ...identification_association, UserId: newRepresentantLegale.id})
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
    renouvellement: function(req, res){

    }
}