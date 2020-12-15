require('dotenv').config();
var models = require('../models');
var confirm = require('../utils/confirmation');
var Add = require('../utils/AddUser');
var public = require('./filesCtrl');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = {
    /*
    * --postuler--
    * Demande de donnée personnel pour la candidature au service civique
    * Et envoi toute les données par mail à l'administrateur
    */
    postuler: function(req, res){

        var email = req.body.email;
        var theme = req.body.theme;
        var cv = req.body.cv;
        var lMotiv = req.body.lMotiv
        var status = 'ServiceCivique';
        var isAdmin = 0;
        var message = `<div>
                        <h1>Vous avez postulé</h1>
                        <p>Votre candidature a bien été envoyer vous recevrez bientôt une réponse</p>
                    </div>`;
        var attachments = [{
                        filename: cv.realname,
                        path: './public/' + cv.realname
                    },
                    {
                        filename: lMotiv.realname,
                        path: './public/' + lMotiv.realname
                    }];

        if(email == null )
        {
            return res.status(400).json({ 'erreur': "paramètre manquant" });
        }

        if(!EMAIL_REGEX.test(email)){
            return res.status(400).json({ "erreur": "Votre email n'est pas valide" });
        }

        if(status != 'ServiceCivique' && status != 'Association' && isAdmin == 0 ){
            return res.status(400).json({ 'erreur': 'paramètre manquant'});
        }

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound){
            if(!userFound) {
                message1 = 
                    `<div>
                        <h1>Quelqu'un souhaite postuler</h1>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Thème qui l'intéresse:</strong> ${theme}</p>
                        <a href='#'>Confirmer son inscription</a>
                    </div>`;
                var send = confirm.send(req, res, message1, 'noxbike@gmail.com',attachments);
                if(send){
                    confirm.send(req, res, message, email);
                    return res.status(200).json({'message': 'Votre candidature a bien été envoyer'})
                }
                else{
                    return res.status(400).json({'erreur': "impossible d'envoyer votre candidature veuillez contactez l'administrateur"})
                }
            }
            else{
                return res.status(201).json({ 'erreur': 'Vous avez déjà postuler'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'erreur': "impossible de verifier l'utilisateur veuillez contactez l'adminstrateur"});
        })
    },
    /*
    * --Public Upload--
    * Récupère les fichier Cv et lettre de motivation
    * Et le met dans le fichier public
    */
    publicUpload:function(req, res){
        public.upload(req, res, './public')
    },
    /*
    * --accept--
    * Renvoi un message au client service civique
    * Avec son identifiant et son mot de passe générer automatiquement
    */
    accept: function(req, res){
        var email = req.params.email;
        var status = 'Service-Civique';
        var isAdmin = 0;

        Add.add(req, res, email, status, isAdmin);

        var message = `
                <div>
                    <h1>Félicitation votre candidature à été accepter<h1>
                    <p>Vous recevrez par email ou par téléphone les prochaines instruction a suivre</p>
                </div>`

        confirm.send(req, res, message, email);
    }
}