var express = require('express');
var usersCtrl = require('./routes/usersCtrl');

exports.router = (function() {
    var apiRouter = express.Router();

    //users routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/login/').put(usersCtrl.login);
    apiRouter.route('/users/access/').post(usersCtrl.acces);

    return apiRouter;
}) ();