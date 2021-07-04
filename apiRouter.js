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
const gallerieCtrl = require('./routes/gallerieCtrl');

const confirm = require('./utils/confirmation');
const videoCtrl = require('./routes/videoCtrl');
const { calendar } = require('googleapis/build/src/apis/calendar');

exports.router = (function() {
    var apiRouter = express.Router();

    //users routes
    apiRouter.route('/users/password').post(usersCtrl.ChangePassword);
    apiRouter.route('/users/getEmail/').post(usersCtrl.getUser);
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/admin/liste').get(usersCtrl.listAdmin);
    apiRouter.route('/admin/create').post(usersCtrl.addAdmin);
    apiRouter.route('/admin/delete').delete(usersCtrl.deleteAdmin);
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/auth/').get(usersCtrl.auth);
    apiRouter.route('/dashboard/').get(usersCtrl.dashboard);
    
    apiRouter.route('/serviceCivique/postuler/').post(serviceCiviqueCtrl.postuler);
    apiRouter.route('/public/file/').post(serviceCiviqueCtrl.publicUpload);
    apiRouter.route('/file/delete/:filename').delete(filesCtrl.delete);
    apiRouter.route('/serviceCivique/accept/:email').post(serviceCiviqueCtrl.accept);
    
    apiRouter.route('/contact/').post(contactCtrl.send);
    apiRouter.route('/missions/').get(missionsCtrl.intitule);
    apiRouter.route('/services/').get(servicesCtrl.getService);
    apiRouter.route('/salles/').get(servicesCtrl.getSalle);
    apiRouter.route('/reservation/').post(calendarCtrl.demandeReservation);
    apiRouter.route('/articles').get(articleCtrl.get);
    apiRouter.route('/articles/create').post(articleCtrl.create);
    apiRouter.route('/articles/upload').post(articleCtrl.uploadPhoto);
    apiRouter.route('/article/update').put(articleCtrl.update);
    apiRouter.route('/articles/:url').get(articleCtrl.getArticle);
    apiRouter.route('/article/delete/:titre').delete(articleCtrl.delete);
    apiRouter.route('/agenda').get(agendaCtrl.getForAccueil);
    apiRouter.route('/agendas').get(agendaCtrl.get);
    apiRouter.route('/agenda/:url').get(agendaCtrl.getAgenda);
    apiRouter.route('/agenda/create').post(agendaCtrl.create);
    apiRouter.route('/agenda/update').put(agendaCtrl.update);
    apiRouter.route('/agenda/upload').post(agendaCtrl.uploadPhoto);
    apiRouter.route('/agenda/delete/:titre').delete(agendaCtrl.delete);
    apiRouter.route('/carousel').get(carouselCtrl.affichageCarousel);
    apiRouter.route('/carousel/reorder').put(carouselCtrl.reOrder);
    apiRouter.route('/carousel/upload').post(carouselCtrl.upload);
    apiRouter.route('/carousel/add').post(carouselCtrl.add);
    apiRouter.route('/carousel/delete/:photo').delete(carouselCtrl.delete);
    apiRouter.route('/partenaire').get(partenaireCtrl.AffichagePartenaire);
    apiRouter.route('/video').get(videoCtrl.get);
    apiRouter.route('/video/update').put(videoCtrl.update);
    apiRouter.route('/videos').get(videoCtrl.getAll);
    apiRouter.route('/video/delete/:titre').delete(videoCtrl.delete);
    apiRouter.route('/video/create').post(videoCtrl.create);

    apiRouter.route('/gallerie').get(gallerieCtrl.get);
    apiRouter.route('/gallerie/:name').get(gallerieCtrl.getOne);
    apiRouter.route('/gallerie/upload').post(gallerieCtrl.uploadPhoto);
    apiRouter.route('/gallerie/update').put(gallerieCtrl.update);
    apiRouter.route('/gallerie/dossier/create').post(gallerieCtrl.createFolder);
    apiRouter.route('/gallerie/:dossier/upload').put(gallerieCtrl.uploadInFolder);
    apiRouter.route('/gallerie/dossier/delete/:name').delete(gallerieCtrl.deleteDossier);
    apiRouter.route('/gallerie/:dossier/delete/:index').delete(gallerieCtrl.deletePhoto);

    apiRouter.route('/calendarId').get(calendarCtrl.listCalendar);
    apiRouter.route('/request/calendar/').get(calendarCtrl.listCalendarNotTreated);
    apiRouter.route('/accepted/calendar/:id').post(calendarCtrl.confirmation);
    apiRouter.route('/rejected/calendar/:id').delete(calendarCtrl.delete);
    apiRouter.route('/calendar/data/:id').get(calendarCtrl.getOne);
    apiRouter.route('/calendar/rendez-vous').post(calendarCtrl.demandeRendezVous);
    apiRouter.route('/pay/calendar/:id').post(calendarCtrl.demandeDePayer);

    apiRouter.route('/nouvelle-adhesion').post(adhesionCtrl.nouveaux);
    apiRouter.route('/private/file/').post(adhesionCtrl.uploadDocument);

    /*apiRouter.route('/file/carousel/delete).delete(carousleCtrl.deleteCarousel);*/

    apiRouter.route('/association/list').get(adhesionCtrl.list);
    apiRouter.route('/association/accepter/:name').post(adhesionCtrl.accepter);
    apiRouter.route('/pages/list').get(adhesionCtrl.listPage);
    apiRouter.route('/page/:name').get(adhesionCtrl.page);
    apiRouter.route('/page/update/:lien').put(adhesionCtrl.pageVisibility);
    apiRouter.route('/page/delete/:lien').delete(adhesionCtrl.deletePage);
    apiRouter.route('/create/page/logo').post(adhesionCtrl.uploadLogo);
    apiRouter.route('/create/page/photo').post(adhesionCtrl.uploadPhoto);
    apiRouter.route('/newpage').post(adhesionCtrl.newpage);
    apiRouter.route('/clearCookie').get(usersCtrl.cookieClear);
    return apiRouter;
}) ();