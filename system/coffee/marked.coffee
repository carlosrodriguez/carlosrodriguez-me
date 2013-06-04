# Modules
lodash = require 'lodash'
marked = require 'marked'

config = require './config.js'

setOptions = (opts) ->
	options =
		gfm: true
		tables: true
		breaks: false
		pedantic: false
		sanitize: true
		smartLists: true
		langPrefix: 'language-',
		highlight: (code, lang) ->
			if (lang == 'js') then highlighter.javascript code else code

	lodash.extend options, opts

# Get Mata Data
getMeta = (source) ->
	meta = require 'markdown-extra'

	meta.metadata source, (md) ->
		retObj = {}
		md.split("\n").forEach (line) ->
			data = line.split(":")
			retObj[data[0].trim().toLowerCase()] = data[1].trim()

		retObj

# Render
exports.renderMarkdown = (source, opts) ->
	matchers =
		truncate: /\#{2}\!{2}truncate\s*[\n]?/,
		linkdef: /^ *\[([^\]]+)\]: *([^\s]+)(?: +["(]([^\n]+)[")])? *(?:\n+|$)/

	setOptions opts
	# Extract Meta information
	meta = lodash.extend config.config(), getMeta(source)
	sourceContent = source.replace /<!--(\n(.*))*-->/g, ""
	tokens = marked.lexer sourceContent
	content = marked.parser tokens
	{
		content: content
		author: meta.author
		title: meta.title
	}