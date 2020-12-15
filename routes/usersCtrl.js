var models = require('../models');
var Add = require('../utils/AddUser');
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var config = require('../config/token.config.json')
var jwt = require('jsonwebtoken');
var confirmation = require('../utils/confirmation')

const jwt_SIGN_SECRET = '0sjs6gf9nwxq22pzn5hvpxmpgtty34tfxBgz17sy6djnm0xuc65bi9rcc';


//constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORDREGEX = /^(?=.*\d).{4,8}$/;

module.exports = {
    register: function(req, res){
        var email = req.body.email;
        var password = req.body.password;
        var status = req.body.status;
        var isAdmin = 0;
        if(email == null || password == null)
        {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if(!EMAIL_REGEX.test(email)){
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        if(!PASSWORDREGEX.test(password)){
            return res.status(400).json({ 'error': 'password invalid(must length 4 - 8 and include 1 number at least' });
        }

        if(status != 'ServiceCivique' && status != 'Association' && isAdmin == 0 ){
            return res.status(400).json({ 'error': 'you should have a status for register'});
        }

        Add.Add(req, res);
    },

    login: function(req, res){

        //params
        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password == null)
        {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        models.User.findOne({
            where: { email: email }
        })
        .then(function(userFound){
            if(userFound){
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
                    if(resBycrypt){
                        var token = jwtUtils.generateTokenForUser(userFound.id);
                        models.RefreshToken.findOne({
                            attributes: ['id', 'userId'],
                            where: { userId: userFound.id }
                        }).then(function(tokenFound){
                            if(!tokenFound){
                                var newtoken = models.RefreshToken.create({
                                    userId: userFound.id,
                                    token: token.refreshToken,
                                    expireAt: Date.now() + config.accessToken.expiresIn
                                })
                            }
                            else{
                                var newtoken = models.RefreshToken.update(
                                    {token: token.refreshToken, expireAt: Date.now() + config.accessToken.expiresIn },
                                    {where: { id: tokenFound.id}}
                                ).then(function(newtoken){
                                    if(newtoken){
                                        for (let value in token){
                                            if(value !== 'xsrfToken'){
                                                res.cookie(value, token[value], {
                                                    httpOnly: true,
                                                    secure: false,
                                                    maxAge: value == 'refreshToken' ? config.accessToken.expiresIn : config.accessToken.expiresIn / 2
                                                });
                                            }
                                            else{
                                                var xsrfToken = token[value];
                                            }
                                        }
                                        return res.status(200).json({ 'token': xsrfToken, 'userId': userFound.id});
                                    }
                                })
                                .catch(function(err){
                                    return res.status(500).json({ 'error': err})
                                })
                            }
                        }).catch(function(err){
                            return res.status(500).json({'error': 'erreur interne'});
                        })
                    }
                    else{
                        return res.status(404).json({ 'error': 'user not exist in DB' })
                    }
                })
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'unable to verify user'});
        });

    },
    getUser: function(req, res){
        const email = req.body.email;
        const code = req.body.code;
        var message = `<h2>Creer un nouveau de mot de passe</h2 style='font-size:1.2em;'><p> Voici votre code secret: <strong>${ code }</strong></p>`;

        models.User.findOne({
            where: { email: email }
        })
        .then(function(userFound){
            if(userFound){
                var sendcode = confirmation.send(req, res, message, email)
                if(sendcode){
                    return res.status(200).json({'message': 'code envoyer'})
                }
                else{
                    return res.status(500).json({'erreur': "echec de l'envoi"})
                }
            }
            else{
                return res.status(404).json({'erreur': 'utilisateur inexistant'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ "erreur": "erreur interne veuillez contactez l'administrateur"});
        });
    },
    ChangePassword: function(req, res){
        const email = req.body.email;
        const password = req.body.password;

        models.User.findOne({
            attributes:['id', 'email', 'password'],
            where: { email: email }
        })
        .then(function(userFound){
            if(userFound){
                bcrypt.hash(password, 5, function(err, bcryptedPassword ){
                    var newPassword =  models.User.update(
                        {password: bcryptedPassword},
                        {where: {email: email}}
                    )
                    .then(function(newPassword) {
                        return res.status(201).json({"message": "mot de passe changer" })
                    })
                    .catch(function(err){
                        return res.status(500).json({ 'erreur': "impossible d'ajouter le mot de passe veuillez contactez l'administrateur" });
                    })
                })
            }
            else{
                return res.status(404).json({'erreur': "utilisateur inexistant"})
            }
        })
        .catch(function(err){
            return res.status(500).json({'erreur': "erreur interne veuillez contactez l'administrateur"})
        })
    },
    auth: function(req, res){
        const { cookies, headers } = req;
        var user = -1
        if(cookies && headers){
            try{
                const accessToken = cookies.accessToken;

                const xsrfToken = headers['x-xsrf-token'];

                const decodedToken = jwt.verify(accessToken, jwt_SIGN_SECRET, {
                    algorithms: config.algorithm
                });
                if (xsrfToken !== decodedToken.xsrfToken) {
                    return false;
                }
            
                const userId = decodedToken.sub;
                models.User.findOne({ 
                    attributes: ['id'],
                    where: { id: userId } 
                })
                .then(function(userFound){
                    if(userFound){
                        return res.status(200).json({ 'user': true });
                    }
                    else{
                        return res.status(200).json({ 'user': false });
                    }
                })
            }
            catch(err){
                return res.status(200).json({ 'user': false });
            }
        }
        
    }
}