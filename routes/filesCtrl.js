var multer = require('multer');
var fs = require('fs');

module.exports = {
    upload: function(req, res, chemin){
        var storage2 = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, chemin)
            },
            filename: function (req, file, cb) {
              cb(null, + Date.now() + '-' + file.originalname )
            }
          })

        var upload = multer({ storage: storage2 }).single('file');

        upload(req, res, function (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err)
                } else if (err) {
                    return res.status(500).json(err)
                }
            return res.status(200).json({'file': req.file.filename})
        })
    },
    
    delete: function(req, res){
        fs.unlink('./public/' + req.params.filename, function(err) {
            if (err) {
              return res.status(404).json({'message': 'not file with this name'})
            };
          
            return res.status(200).json({'message': 'file deleted'});
          });
    },
    deleteLocal: function(req, res, filename){
      fs.unlink(filename, function(err) {
          if (err) {
            return res.status(404).json({'message': 'not file with this name'})
          };
        
          console.log('file deleted');
        });
  }
}