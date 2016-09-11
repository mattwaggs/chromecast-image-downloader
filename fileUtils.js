var fs   = require('fs');
var path = require('path');
var del  = require('del');

module.exports = {

    mkdirIfNotExists: function(targetPath, clearIfNotEmpty) {
        try {
            fs.mkdirSync(targetPath);
        } catch(e) {
            if(e.code == 'EEXIST') {
                if(clearIfNotEmpty) {
                    del.sync([path.join(targetPath, '**')]);
                    fs.mkdirSync(targetPath);
                }
            }else{
                throw e;
            }
        }
    }
};
