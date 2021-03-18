var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var serviceCiviqueCtrl = require('./routes/serviceCiviqueCtrl');
const calendarCtrl = require('./routes/calendarCtrl');
const contactCtrl = require('./routes/contactCtrl');
const missionsCtrl = require('./routes/missionsCtrl');
const articleCtrl = require('./routes/articleCtrl');
const agendaCtrl = require('./routes/agendaCtrl');
const servicesCtrl = require('./routes/servicesCtrl');
const filesCtrl = require('./routes/filesCtrl');
const adhesionCtrl = require('./routes/adhesionCtrl');
const carouselCtrl = require('./routes/carouselCtrl');
const partenaireCtrl = require('./routes/partenaireCtrl');

const confirm = require('./utils/confirmation');
const videoCtrl = require('./routes/videoCtrl');
const { calendar } = require('googleapis/build/src/apis/calendar');

exports.router = (function() {
    var apiRouter = express.Router();

    //users routes
    apiRouter.route('/users/password').post(usersCtrl.ChangePassword);
    apiRouter.route('/users/getEmail/').post(usersCtrl.getUser);
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/auth/').get(usersCtrl.auth);
    
    apiRouter.route('/serviceCivique/postuler/').post(serviceCiviqueCtrl.postuler);
    apiRouter.route('/public/file/').post(serviceCiviqueCtrl.publicUpload);
    apiRouter.route('/file/delete/:filename').delete(filesCtrl.delete);
    apiRouter.route('/serviceCivique/accept/:email').post(serviceCiviqueCtrl.accept);
    
    apiRouter.route('/contact/').post(contactCtrl.send);
    apiRouter.route('/missions/').get(missionsCtrl.intitule);
    apiRouter.route('/services/').get(servicesCtrl.getService);
    apiRouter.route('/salles/').get(servicesCtrl.getSalle);
    apiRouter.route('/reservation/').post(calendarCtrl.send);
    apiRouter.route('/articles').get(articleCtrl.get);
    apiRouter.route('/articles/:url').get(articleCtrl.getArticle);
    apiRouter.route('/agenda').get(agendaCtrl.get);
    apiRouter.route('/agenda/:url').get(agendaCtrl.getAgenda);
    apiRouter.route('/carousel').get(carouselCtrl.affichageCarousel);
    apiRouter.route('/partenaire').get(partenaireCtrl.AffichagePartenaire);
    apiRouter.route('/video').get(videoCtrl.get);

    apiRouter.route('/calendarId').get(calendarCtrl.listCalendar);
    apiRouter.route('/request/calendar/').get(calendarCtrl.listCalendarNotTreated);
    apiRouter.route('/accepted/calendar/:id').post(calendarCtrl.add);
    apiRouter.route('/rejected/calendar/:id').delete(calendarCtrl.rejected);
    apiRouter.route('/calendar/data/:id').get(calendarCtrl.getOne);
    apiRouter.route('/calendar/rendez-vous').post(calendarCtrl.sendRV);
    apiRouter.route('/pay/calendar/:id').post(calendarCtrl.pay);

    apiRouter.route('/nouvelle-adhesion').post(adhesionCtrl.nouveaux);
    apiRouter.route('/private/file/').post(adhesionCtrl.uploadDocument);

    apiRouter.route('/file/carousel/add').post(carouselCtrl.addCarousel);
    /*apiRouter.route('/file/carousel/delete).delete(carousleCtrl.deleteCarousel);*/

    return apiRouter;
}) ();