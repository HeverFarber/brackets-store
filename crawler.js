var request = require("request"),
    zlib = require('zlib'),
    fs = require('fs'),
    async = require('async'),
    Download = require('download'),
    progress = require('download-status');

var url = "http://s3.amazonaws.com/extend.brackets/{0}/{0}-{1}.zip";
var STORAGE_PATH = 'storage';
var VERSION_REG = /^[0-9.-_a-zA-Z]*$/

request({method: 'GET', gzip: true, uri: 'https://s3.amazonaws.com/extend.brackets/registry.json'}, function (error, response, body) {
    var packages = JSON.parse(body);
    
    if (!fs.existsSync(STORAGE_PATH))
        fs.mkdir(STORAGE_PATH);
    
    fs.writeFileSync(STORAGE_PATH + '/registry.json', JSON.stringify(packages));
    
    var size = Object.keys(packages).length, counter = 1;
    
    async.eachSeries(Object.keys(packages), function(pack, next){
        var curr = packages[pack];
        
        async.waterfall([
            function(callback){
                console.log("==============================================================================");
                console.log("                       " + pack + "  " +  counter++ + "/" + size);
                console.log("==============================================================================");
                
                fs.mkdir(formater(STORAGE_PATH + '/{0}', pack), function (err){
                    callback();
                });
            },
            function(callback){
                var uri = [];
                
                async.each(curr.versions, function (item, cb){
                    fs.exists(formater(STORAGE_PATH + '/{0}/{0}-{1}.zip', pack,item.version), function (exist){
                        if (!VERSION_REG.test(item.version))
                            console.log(item.version + " invalid version");
                        else if (!exist)
                            uri.push(formater(url, pack, item.version));
                        else
                            console.log(formater('{0}/{0}-{1}.zip', pack,item.version) + " exists");
                        
                        cb();
                    });
                }, function(err){
                    callback(null, uri);
                });
            },
            function(uri ,callback){
                if (uri.length > 0){
                    var down = new Download({}).dest(formater(STORAGE_PATH + '/{0}', pack)).use(progress());
                
                    uri.forEach(function (url){
                        down.get(url);
                    });
                    
                    down.run(function (err, files, stream){
                        callback();
                    });
                }
                else
                    callback();
            }], function (err, result){
                next();
        });     
    }, function(err){
        
    });       
});

function formater(str) {
    // arguments[0] is the base string, so we need to adjust index values here
    var args = [].slice.call(arguments, 1);
    return str.replace(/\{(\d+)\}/g, function (match, num) {
        return typeof args[num] !== "undefined" ? args[num] : match;
    });
}
