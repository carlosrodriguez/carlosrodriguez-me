request = require 'request'
path = require 'path'
http = require 'http'
lodash = require 'lodash'
wordpress = require 'wordpress'

# Custom modules
render = require './render.js'
config = require './config.js'

console.log config.config()

client = wordpress.createClient config.config()

# Setup JSON file reader
require.extensions['.json'] = (m) ->
	m.exports = JSON.parse fs.readFileSync m.filename 
	return

savePost = (post) ->
	console.log post
	console.log "POST"
	client.newPost post, (error, id) ->
		console.log error
		console.log id
		return
	return

render.readFiles (data) -> 
	lodash.each data, savePost
	return

	# if ( post.id ) {
	# 	// Get existing custom fields
	# 	grunt.verbose.write( "Getting custom fields for " + name + "..." );
	# 	client.getPost( post.id, [ "customFields" ], function( error, postData ) {
	