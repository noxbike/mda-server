var models = require('../models');

module.exports = {
    get: function(req, res){
        models.Article.findAll({
            order:[
                ['id', 'DESC']
        ]
        })
        .then(function(articleFound){
            if(articleFound){
                var firstArticle = [];
                var articleAccueil = [];
                for(let i = 0; i < 3; i++){
                    if(i == 0){
                        firstArticle.push(articleFound[i])
                    }
                    else{
                        articleAccueil.push(articleFound[i])
                    }
                }
                return res.status(201).json({ firstArticle, articleAccueil, articleFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
    getArticle: function(req, res){
        var url = req.params.url;

        models.Article.findOne({
           where:{url: url}
        })
        .then(function(articleFound){
            if(articleFound){
                return res.status(201).json({ articleFound })
            }
            else{
                return res.status(404).json({ 'error': 'not found'})
            }
        })
        .catch(function(err){
            return res.status(500).json({ 'error': err})
        })
    },
}