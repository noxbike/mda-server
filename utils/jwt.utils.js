var jwt = require('jsonwebtoken');

const jwt_SIGN_SECRET = '0sjs6gf9nwxq22pzn5hvpxmpgtty34tfxBgz17sy6djnm0xuc65bi9rcc';

module.exports = {
    generateTokenForUser: function(userData){
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
        },
        jwt_SIGN_SECRET,
        {
            expiresIn: '1h'
        })
    },
    parseAuthorization: function(authorization){
        return (authorization != null) ? authorization.replace('Bearer ' , '') : null;
    },
    getUserId: function(authorization){
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization);
        if(token != null) {
            try{
                var jwtToken = jwt.verify(token, jwt_SIGN_SECRET);
                if(jwtToken != null)
                userId = jwtToken.userId;
            }
            catch(err){
            return res.status(500).json({ 'error': 'missing token' });
            }
        }
        return userId
    }
}