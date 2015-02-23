/*!
* jfp-persistence
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  access = require('./lib/access.js'),
	 dataView = require('./lib/dataView.js');

var  accLayer;

exports.config = function(option)  {
	accLayer = access(option);
};


exports.install = function(jsonfp, packageName)  {
	if (packageName)
		packageName = packageName + '/';
	else
		packageName = '';

	jsonfp.addMethod(packageName + 'load', doLoad);
	jsonfp.addMethod(packageName + 'save', doSave);
	jsonfp.addMethod(packageName + 'add', doAdd);
	jsonfp.addMethod(packageName + 'delete', doDel);
};


exports.entityView = function(entityName) {
	return  new dataView( entityName );
};

/*
* input: the query value
* entityView: data access view of an entity
*/
function doLoad(input, entityView)  {
	return  accLayer.load(entityView, input);
};


function doSave(input, option)  {
	return  accLayer.save(option.view, input, option.query);
};


function doAdd(input, entity)  {
	return  accLayer.add(entity, input);
};


function doDel(input, entityView)  {
	return  accLayer.del(entityView, input);
};


/*
* option is an array of expressions. Any jfp-persist actions enclosed in the array of expressions will be performed
* in a way like transactions.
*/
exports.atomic = function(input, option)  {

};