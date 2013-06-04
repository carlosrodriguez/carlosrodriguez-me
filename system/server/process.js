var client, config, createChecksum, crypto, flatten, fs, getCurrentPosts, http, lodash, path, render, request, savePost, util, wordpress;

request = require('request');

fs = require('fs');

path = require('path');

crypto = require('crypto');

http = require('http');

lodash = require('lodash');

util = require('util');

wordpress = require('wordpress');

render = require('./render.js');

config = require('./config.js');

client = wordpress.createClient(config.config());

require.extensions['.json'] = function(m) {
  m.exports = JSON.parse(fs.readFileSync(m.filename));
};

flatten = function(obj) {
  if (obj == null) {
    return "";
  }
  if (typeof obj === "string") {
    return obj;
  }
  if (typeof obj === "number") {
    return String(obj);
  }
  if (util.isDate(obj)) {
    return obj.toGMTString();
  }
  if (util.isArray(obj)) {
    return obj.map(function(item) {
      return flatten(item);
    }).join(",");
  }
  return Object.keys(obj).sort().map(function(prop) {
    return prop + ":" + flatten(obj[prop]);
  }).join(";");
};

getCurrentPosts = function() {
  return client.call("gw.getPostPaths", "any", function(error, postPaths) {
    if (error) {
      console.log("Error getting posts");
    }
    return console.log(postPaths);
  });
};

createChecksum = function(obj) {
  var md5;

  md5 = crypto.createHash("md5");
  md5.update(flatten(obj), "utf8");
  return md5.digest("hex");
};

savePost = function(post) {
  console.log(post);
  if (post.id) {
    console.log("Post exits - Checksum");
    return console.log(createChecksum(post));
  } else {
    return client.newPost(post, function(error, id) {
      var content;

      content = fs.readFileSync(post.source, "utf8");
      fs.writeFile(post.source, content.replace("<!--", "<!--\nid: " + id + "\nstatus: publish"));
    });
  }
};

render.readFiles(function(data) {
  getCurrentPosts();
  lodash.each(data, savePost);
});
