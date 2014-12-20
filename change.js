var fs = require("fs");

var server_url = (process.env.npm_config_url) ? process.env.npm_config_url : "http://localhost";
var server_port = (process.env.npm_config_port) ? 
                        process.env.npm_config_port : 
                        (process.env.npm_package_config_port) ? 
                                            process.env.npm_package_config_port : 
                                            8080;

var url = {old_extension_registry:"https://s3.amazonaws.com/extend.brackets/registry.json", 
           old_extension_url:"https://s3.amazonaws.com/extend.brackets/{0}/{0}-{1}.zip",
           new_extension_registry:server_url + ":" + server_port + "/registry.json",
           new_extension_url:server_url + ":" + server_port + "/{0}/{0}-{1}.zip"};

var action = (process.argv[2] == "restore") ? "old" : "new";

if (process.env.os.toLowerCase().indexOf("windows") == -1)
    process.exit(1);

var path;

if (fs.existsSync(process.env["ProgramFiles"] + "/Brackets/www/config.json"))
    path = process.env["ProgramFiles"] + "/Brackets/www/config.json";

if (fs.existsSync(process.env["ProgramFiles(x86)"] + "/Brackets/www/config.json"))
    path = process.env["ProgramFiles(x86)"] + "/Brackets/www/config.json";

if (!path)
    process.exit(1);

var config = JSON.parse(fs.readFileSync(path));

config.config.extension_registry = url[action + "_extension_registry"];
config.config.extension_url = url[action + "_extension_url"];

fs.writeFileSync(path, JSON.stringify(config, null, 4));

console.log("config is change");