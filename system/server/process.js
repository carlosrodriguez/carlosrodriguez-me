var client, config, http, lodash, path, render, request, savePost, wordpress;

request = require('request');

path = require('path');

http = require('http');

lodash = require('lodash');

wordpress = require('wordpress');

render = require('./render.js');

config = require('./config.js');

console.log(config.config());

client = wordpress.createClient(config.config());

require.extensions['.json'] = function(m) {
  m.exports = JSON.parse(fs.readFileSync(m.filename));
};

savePost = function(post) {
  console.log(post);
  console.log("POST");
  client.newPost(post, function(error, id) {
    console.log(error);
    console.log(id);
  });
};

render.readFiles(function(data) {
  lodash.each(data, savePost);
});
