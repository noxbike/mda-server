var models = require('../models');
var bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
const user = require('../models/user');

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

        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(function(userFound){
            if(!userFound) {
                bcrypt.hash(password, 5, function(err, bcryptedPassword ){
                    var newUser =  models.User.create({
                        email: email,
                        isAdmin: isAdmin,
                        status: status,
                        password: bcryptedPassword
                    })
                    .then(function(newUser) {
                        return res.status(201).json({
                            'userId': newUser.id
                        })
                    })
                    .catch(function(err){
                        return res.status(500).json({ 'error': 'cannot add user' });
                    })
                })
            }
            else{
                return res.status(400).json({ 'error': 'user already exist' });
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': 'unable to verify user'});
        })
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
                        if(userFound.secret == null){
                            var token = jwtUtils.generateTokenForUser(userFound.id);
                            userFound.update(
                                { secret: token },
                                { where: { id: userFound.id } }
                            )
                            .then(function(success){
                                return res.status(200).json({ 'token': token});
                            })
                            .catch(function(err){
                                return res.status(500).json({ 'error': 'error token not generate'});
                            });
                        }
                        else{
                            return res.status(200).json({ 'token': userFound.secret});
                        }
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
    acces: function(req, res){

        var headerAuth = req.headers['authorization'];
        var userAccess = jwtUtils.getUserId(headerAuth);

        models.User.findOne({
            attributes: ['id', 'email'],
            where: { id: userAccess }
        })
        .then(function(userfound){
            return res.status(201).json({ 'email': userfound.email })
        })
    }
}