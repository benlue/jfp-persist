/*!
* jfp-persistence
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  assert = require('assert'),
	 access = require('../access.js'),
	 dataView = require('../dataView.js');

var  accLayer;

before(function()  {
    var  option = {
    	storage: 'dbms/mySql',
    	dbConfig: {
    		"host"     : "127.0.0.1",
			"database" : "nstest",
			"user"     : "root",
			"password" : "root",
			"supportBigNumbers" : true,
			"connectionLimit"   : 32
    	}
    };

    accLayer = access(option);
});

describe('Test the access layer', function()  {

    it('Getting instances', function(done) {
    	var  view = new dataView('Person');
    	view.fields(['Person_id', 'name', 'weight']).
    	filter({name: 'weight', op: '>'});

    	var  result = accLayer.load( view.value(), {weight: 150} );
    	result.then(function(list) {
    		//console.log( JSON.stringify(list, null, 4) );
    		assert.equal( list.length, 3, '3 matches');
    		done();
    	}).
    	catch(function(err) {
    		console.log( err.stack );
    		done();
    	});

    	//assert.equal(accLayer.load({name: 'Hello'}).name, 'Hello', 'Should return Hello');
    });
});