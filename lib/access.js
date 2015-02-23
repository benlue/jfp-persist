/*!
* jfp-persistence
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
module.exports = function(option)  {
	return  new accLayer(option);
};


var  accLayer = function(option) {
	option = option || {};
	var  storageType = option.storage || 'dbms/mySql';
	
	switch (storageType)  {
		case 'dbms/mySql':
			this.storage = require('./storage/mySqlStore.js');
			this.storage.config( option );
			break;
	}

	this.load = load;
	this.save = save;
	this.add = add;
	this.del = del;
};

/*
* Load objects from a persistent storage. The 'query' parameter is the object value for query.
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
function load(view, query) {
	return this.storage.load(view, query);
};

/*
* Save an object to a persistent storage. The 'data' parameter specifies what to be saved.
* The 'query' parameter is the object value for query. The 'view' parameter has the following properties:
*   . entity: name of the entity
*   . fields: specifies an array of entity fields to be saved. If not specified, all data properties will be saved.
*   . terms: query conditions
*/
function save(view, data, query) {
	return this.storage.save(view, data, query);
};

/*
* Add a new item to the persistent storage. This function will try to save 'every' property of the 'data' parameter.
* If it's done successfully, the primary key value of the newly added entry will be returned.
*/
function add(entity, data)  {
	return this.storage.add(entity, data);
};

/*
* Remove an object from a persistent storage. The 'query' parameter is the object value for query.
* The 'view' parameter has the following properties:
*   . entity: name of the entity
*   . terms: query conditions
*/
function del(view, query)  {
	return this.storage.del(view, query);
};


exports.atomic = function()  {

};