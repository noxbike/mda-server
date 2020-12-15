require('dotenv').config();
var confirm = require('../utils/confirmation');

module.exports = {
    send: function(req, res){
        var email = req.body.email;
        var numero = req.body.numero;
        var association = req.body.association;
        var nom = req.body.nom;
        var prenom = req.body.prenom;
        var message = req.body.message;

        if(email == null || numero == null || association == null || nom == null || prenom == null || message == null)
        {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        var message1 = 
        `<div>
            <h1>Quelqu'un souhaite vous contacter</h1>
            <div style='text-align: left;'>
                <p><strong>Association:</strong> ${association}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Téléphone:</strong> ${numero}</p>
                <p><strong>Nom:</strong> ${nom}</p>
                <p><strong>Prénom:</strong> ${prenom}</p>
                <p><strong>Message:<strong/></p>
                <p>${message}</p>
            </div>
        </div>`;

        var message2 = 
                    `<div>
                        <h1>Votre Message a bien été envoyer</h1>
                        <div style='text-align: left;'>
                            <p>Votre message a bien été envoyer vous recevrez une réponse trés bientôt.</p>
                        </div>
                    </div>`;
        confirm.send(req, res, message1, 'noxbike@gmail.com');
        confirm.send(req, res, message2, email);
    }
}