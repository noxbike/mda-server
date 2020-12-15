require('dotenv');
const models = require('../models');
const {google} = require('googleapis');
const { OAuth2 } = google.auth;
var confirm = require('../utils/confirmation');
var moment = require('../utils/moment');

module.exports = {
    send: async function(req, res){

        var association = req.body.association;
        var nombrePersonne = req.body.nombrePersonne;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var description = req.body.description;
        var email = req.body.email;
        var calendarId = req.body.calendarId;
        
        if(association == null || nombrePersonne == null || startTime == null || endTime == null || calendarId == null){
            return res.status(400).json({ 'erreur': 'paramètre manquante'})
        }

        var Start = new Date(startTime).getHours();
        var End = new Date(endTime).getHours();

        if(Start < 8 || Start > 19 || End < 8 || End > 20){
            return res.status(400).json({ 'erreur': "Les heures de réservations doivent être entre 8h et 20h"})
        }

        var desc = '';
        description = description ? description.map(item => desc += ' ' + item) : 'aucune réservation de matériel'

        var newReservation = models.Reservation_data.create({
            "association": association,
            "nbrPerson":nombrePersonne,
            "start": startTime,
            "end": endTime,
            "email": email,
            "calendarId": calendarId,
            "description": desc,
            "statut": 0,
        })
        .then(function(newReservation){
            if(newReservation){
                startTime = moment.convert(startTime);
                endTime = moment.convert(endTime);
                var message =
                    `<div>
                        <h1>Quelqu'un souhaite reserver</h1>
                        <div style='text-align: left;'>
                            <p><strong>Association:</strong> ${association}</p>
                            <p><strong>Nombre de personne:</strong> ${nombrePersonne}</p>
                            <p><strong>Salle:</strong> ${calendarId}</p>
                            <p><strong>Date de début:</strong> ${startTime}h</p>
                            <p><strong>Date de fin:</strong> ${endTime}h</p>
                            <p><strong>Matériel:</strong> ${desc}</p>
                            <a href='http://mda-saintbenoit.re/listReservation/${newReservation.id}'>Voir</a>
                        </div>
                    </div>`;
                confirm.send(req, res, message, 'noxbike@gmail.com');

                res.status(200).json({'message': 'Réservation enregistrer, vous reçevrez une confirmation par email'})
            }
            else{
                return res.status(500).json({'erreur': "impossible d'ajouter votre réservation! veuillez contacter l'administrateur"})
            }
        })
        .catch(function(err){
            return res.status(500).json({'erreur': "Erreur interne veuillez contacter l'administrateur"})
        })
    },
    pay: function(req, res){
        const eventId = req.params.id

        models.Reservation_data.findOne({
            where: {id: eventId}
        })
        .then(function(calendarFound){
            if(calendarFound){
                var message = `<div><p>Bonjour, Votre réservation à bien été pris en compte.</p><p>Pour finaliser votre réservation vous devez payer 50euro à la maison des associations de saint-benoit</p></div>`
                confirm.send(req, res, message, calendarFound.email)
                return res.status(200).json({'message': "Email envoyé !"})
            }
            else{
                return res.status(404).json({'erreur': "Réservation inexistante"})
            }
        })
        .catch(function(err){
            return res.status(500).json({'erreur': "erreur interne veuillez contactez l'administrateur"});
        })
    },
    add:function(req, res){
        const eventId = req.params.id

        models.Reservation_data.findOne({
            where: {id: eventId}
        })
        .then(function(calendarFound){
            if(calendarFound){
                if(!calendarFound.statut){
                    models.Reservation_calendarId.findOne({
                        where:{name: calendarFound.calendarId}
                    })
                    .then(function(calendarTarget){
                        if(calendarTarget){
                            const salle = calendarTarget.calendarId;
                            const event = {
                                summary: calendarFound.association,
                                description: `${calendarFound.description}`,
                                colorId: 1,
                                start: {
                                    dateTime: calendarFound.start,
                                    timeZone: 'America/Denver',
                                },
                                end: {
                                    dateTime: calendarFound.end,
                                    timeZone: 'America/Denver',
                                },
                                attendees: [
                                    {email: calendarFound.email},
                                ],
                            }

                            const oAuth2Client = new OAuth2(
                                '875656095592-1cnns19kqqqo9k1rv6sgf8v4g0fd6ld3.apps.googleusercontent.com',
                                '8qOHhl6twN9iO6X59h1V-nX5'
                            )
                            
                            oAuth2Client.setCredentials({
                                refresh_token: '1//04YR5hMf8OaykCgYIARAAGAQSNwF-L9IrdXeHfoIQTlIlFXsDqVkXgxAFtyW1yJLrthJ8gbLa2X1cHx0eff-JjH-fjeDfZVB-5iQ',
                            })
                            
                            const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })
                            calendar.freebusy.query(
                                {
                                    resource: {
                                    timeMin: calendarFound.start,
                                    timeMax: calendarFound.end,
                                    timeZone: 'America/Denver',
                                    items: [{ "id": salle }],
                                    },
                                },
                                (err, response) => {
                                    
                                    if (err) return res.status(500).json({'erreur': `Free Busy Query Error:  ${err}`})
                                    
                                    const eventArr = response.data.calendars[salle].busy
                                    if (eventArr.length === 0)
                                    return calendar.events.insert(
                                        { calendarId: salle, resource: event },
                                        err => {

                                        if (err) return res.status(400).json({'erreur':'Erreur de création de la réservation:', err});
                                            var eventup = models.Reservation_data.update(
                                                {statut: 1 },
                                                {where: { id: calendarFound.id}
                                            })
                                            .then(function(eventup){
                                                if(eventup){
                                                    var message =`<h3 style='font-weight: 700;'>Votre Réservation est confirmé</h3>`;
                                                    confirm.send(req, res, message, calendarFound.email);
                                                    return res.status(200).json({'message': 'Réservation ajouté.'});
                                                }
                                                else{
                                                    return res.status(401).json({'erreur': 'impossible de mettre à jour la réservation'})
                                                }
                                            })
                                            .catch(function(err){
                                                return res.status(401).json({'erreur': "erreur interne veuillez contactez l'administrateur"})
                                            })
                                        }
                                    )
                                    return res.status(401).json({'erreur': "Il y à déjà une réservation"});
                                }
                            )
                        }
                        else{
                            return res.status(404).json({'erreur': "Bureau inexistant veuillez contacté l'administrateur"})
                        }
                    })
                    .catch(function(err){
                        return res.status(500).json({'erreur': "erreur interne veuillez contacté l'administrateur"})
                    })
                }
                else{
                    return res.status(400).json({'erreur': 'La réservation à déjà été traité'})
                }
            }
            else{
                return res.status(404).json({"erreur": "Réservation non trouvé!"})
            }
        })
       .catch(function(err){
           return res.status(500).json({ "erreur": "erreur interne veuillez contacté l'administrateur"})
       })
    },
    sendRV: function(req, res){
        var association = req.body.association;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var sujet = req.body.description;
        var email = req.body.email;
        var calendarId = 'Rendez-vous';
        
        if(association == null || email == null || startTime == null || endTime == null || calendarId == null){
            return res.status(400).json({ 'erreur': 'paramètre manquante'})
        }

        var Start = new Date(startTime).getHours();

        if(Start < 8 || Start > 19){
            return res.status(400).json({ 'erreur': "Les heures de réservations doivent être entre 8h et 17h"})
        }

        var newReservation = models.Reservation_data.create({
            "association": association,
            "start": startTime,
            "end": endTime,
            "email": email,
            "calendarId": calendarId,
            "description": sujet,
            "statut": 0,
        })
        .then(function(newRV){
            if(newRV){
                startTime = moment.convert(startTime);
                var message =
                    `<div>
                        <h1>Quelqu'un souhaite prendre un rendez-vous</h1>
                        <div style='text-align: left;'>
                            <p><strong>Association:</strong> ${association}</p>
                            <p><strong>Date du rendez-vous:</strong> ${startTime}h</p>
                            <p><strong>Sujet: </strong> ${sujet}</p>
                            <a href='http://192.168.1.18:3000/listReservation/${newRV.id}'>Voir</a>
                        </div>
                    </div>`;
                confirm.send(req, res, message, 'noxbike@gmail.com');

                res.status(200).json({'message': 'Rendez-vous enregistrer, vous reçevrez une confirmation par email'})
            }
            else{
                return res.status(500).json({'erreur': "impossible d'ajouter votre Rendez-vous! veuillez contacter l'administrateur"})
            }
        })
        .catch(function(err){
           console.log(err)
        })
    },
    rejected: function(req, res){
        var id = req.params.id;

        models.Reservation_data.findOne({
            where:{id: id}
        })
        .then(function(reservationFound){
            if(reservationFound){
                var del = reservationFound.destroy();
                if(del){
                    var message =`<h3 style='font-weight: 700;'>Votre Réservation à été refusé</h3>`;
                    confirm.send(req, res, message, reservationFound.email);
                    return res.status(200).json({'message': 'Réservation supprimer !'})
                }
                else{
                    return res.status(400).json({'erreur': 'Impossible de supprimer'})
                }
            }
            else{
                return res.status(404).json({'erreur': 'Cette réservation est introuvable'})
            }
        })
        .catch(function(err){
            return res.status(500).json({'erreur': "Erreur interne veuillez contactez l'administrateur"})
        })
    },

    listCalendar:function(req, res){
        models.Reservation_calendarId.findAll({
        })
        .then(function(calendarFound){
            if(calendarFound){
                return res.status(201).json({ 'calendarFound': calendarFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    getOne: function(req, res){
        const id = req.params.id;

        models.Reservation_data.findOne({
            where: {id: id}
        })
        .then(function(reservationFound){
            if(reservationFound){
                return res.status(200).json({ reservationFound })
            }
            else{
                return res.status(404).json({ 'erreur': 'réservation introuvable'})
            }
        })
        .catch(function(err){
            return res.status(500).json({'erreur': "erreur interne veuillez contactez l'administrateur"})
        })
    },
    listCalendarNotTreated:function(req, res){
        models.Reservation_data.findAll({
            where: {statut: 0}
        })
        .then(function(calendarFound){
            if(calendarFound){
                return res.status(201).json({ 'calendarFound': calendarFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    }
}