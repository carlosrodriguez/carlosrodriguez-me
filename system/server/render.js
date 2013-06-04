var file, fs, lodash, marked, path, posts, util;

path = require('path');

fs = require('fs');

lodash = require('lodash');

util = require('util');

file = require('file');

marked = require('./marked.js');

posts = path.join(__dirname, '../../wordpress/posts/');

exports.readFiles = function(cb) {
  var data, files;

  data = [];
  files = file.walkSync(posts, function(test, dirPath, files, dirs) {
    lodash.each(files, function(file) {
      var ext;

      ext = path.extname(posts + file);
      if (ext === ".md") {
        return data.push(marked.renderMarkdown(posts + file));
      }
    });
  });
  return cb(data);
};
