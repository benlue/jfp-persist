/*!
* jfp-persistence
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  newsql = require('newsql'),
	 Promise = require('bluebird');

exports.config = function(option)  {
	newsql.config( option );
};


/*
* The 'view' parameter has the following properties
*   . entity: name of the entity
*   . fields: specifies an array of entity fields to be returned. If not specified, every field of the target entity will be returned.
*   . terms: query conditions
*   . groupBy: an array of entity fields by which the return values will be grouped.
*   . orderBy: an array of entity fields by which the return values will be sorted.
*   . range: specifies the return window of the query result
*
* This function will retrun null (if nothing can be found and loaded) or an array.
*/
exports.load = function(view, query)  {
	return  new Promise(function(resolve, reject) {
		newsql.find( view, query, function(err, list) {
			if (err)
				reject(err);
			else
				resolve(list);
		});
	});
};


exports.save = function(view, data, query)  {
	if (view.columns)  {
		// filter out unwanted data
		var  jdata = {},
			 col = view.columns;
		Object.keys(data).forEach(function(key) {
			if (col.indexOf(key) >= 0)
				jdata[key] = data[key];
		});

		data = jdata;
	}

	return  new Promise(function(resolve, reject) {
		newsql.update(view.table.name, data, view.filters, query, function(err) {
			if (err)
				reject(err);
			else
				resolve();
		});
	});
};


exports.add = function(entity, data)  {
	return  new Promise(function(resolve, reject) {
		newsql.insert(entity, data, function(err, pk) {
			if (err)
				reject(err);
			else
				resolve(pk);
		});
	});
};


exports.del = function(view, query)  {
	return  new Promise(function(resolve, reject) {
		newsql.del(view.table.name, view.filters, query, function(err) {
			if (err)
				reject(err);
			else
				resolve();
		});
	});
};