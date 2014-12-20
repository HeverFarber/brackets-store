var express = require('express');
var app = express();

app.use(express.static(__dirname + '/storage'));

var server_port = (process.env.npm_config_port) ? 
                        process.env.npm_config_port : 
                        (process.env.npm_package_config_port) ? 
                                            process.env.npm_package_config_port : 
                                            8080;

app.listen(server_port);
console.log("server is up in port " + server_port + " .....");
console.log();