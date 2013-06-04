var dir, fs, lodash, path, _login;

lodash = require('lodash');

fs = require('fs');

path = require('path');

dir = path.join(__dirname, '../../');

_login = JSON.parse(fs.readFileSync(dir + "_login.js"));

exports.config = function() {
  var config;

  config = {
    author: "Carlos Rodriguez",
    url: "10.0.0.15"
  };
  return lodash.extend(config, _login);
};
