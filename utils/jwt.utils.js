var jwt = require('jsonwebtoken');
var models = require('../models');
var randomBytes = require('randombytes');
var CryptoJS = require('crypto-js');
var config = require('../config/token.config.json')

const jwt_SIGN_SECRET = '0sjs6gf9nwxq22pzn5hvpxmpgtty34tfxBgz17sy6djnm0xuc65bi9rcc';

module.exports = {
    generateTokenForUser: function(userData){
        var xsrfToken = CryptoJS.SHA256(randomBytes(64)).toString(CryptoJS.enc.Hex);
        var refreshToken = CryptoJS.SHA256(randomBytes(128)).toString(CryptoJS.enc.Base64);
        var accessToken = jwt.sign({id: userData, xsrfToken}, jwt_SIGN_SECRET,
            {
                algorithm: config.accessToken.algorithm,
                audience: config.accessToken.audience,
                expiresIn: config.accessToken.expiresIn, // Le délai avant expiration exprimé en seconde
                issuer: config.accessToken.issuer,
                subject: userData.toString()
            })
        var tokens = { 'xsrfToken': xsrfToken, 'refreshToken': refreshToken, 'accessToken': accessToken}
        return tokens;
    },
    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ' , '') : null;
    }
}