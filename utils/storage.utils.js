var multer = require('multer');

module.exports = {
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './public')
        },
        filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
        }
    })
}