var config, getMeta, lodash, marked, setOptions;

lodash = require('lodash');

marked = require('marked');

config = require('./config.js');

setOptions = function(opts) {
  var options;

  options = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    langPrefix: 'language-',
    highlight: function(code, lang) {
      if (lang === 'js') {
        return highlighter.javascript(code);
      } else {
        return code;
      }
    }
  };
  return lodash.extend(options, opts);
};

getMeta = function(source) {
  var meta;

  meta = require('markdown-extra');
  return meta.metadata(source, function(md) {
    var retObj;

    retObj = {};
    md.split("\n").forEach(function(line) {
      var data;

      data = line.split(":");
      return retObj[data[0].trim().toLowerCase()] = data[1].trim();
    });
    return retObj;
  });
};

exports.renderMarkdown = function(source, opts) {
  var content, matchers, meta, sourceContent, tokens;

  matchers = {
    truncate: /\#{2}\!{2}truncate\s*[\n]?/,
    linkdef: /^ *\[([^\]]+)\]: *([^\s]+)(?: +["(]([^\n]+)[")])? *(?:\n+|$)/
  };
  setOptions(opts);
  meta = lodash.extend(config.config(), getMeta(source));
  sourceContent = source.replace(/<!--(\n(.*))*-->/g, "");
  tokens = marked.lexer(sourceContent);
  content = marked.parser(tokens);
  return {
    content: content,
    author: meta.author,
    title: meta.title
  };
};
