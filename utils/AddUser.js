var models = require('../models');
var bcrypt = require('bcrypt');

module.exports = {
    add: function(req, res, email, password, status, isAdmin){

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
            return res.status(500).json({ 'error': err});
        })
    }
}