/*!
* jfp-persistence
* authors: Ben Lue
* license: GPL 2.0
* Copyright(c) 2015 Gocharm Inc.
*/
var  assert = require('assert'),
	 jsonfp = require('jsonfp'),
	 persist = require('../persist.js');

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

    jsonfp.init();
    persist.install(jsonfp, 'Persist');
    persist.config( option );
});

describe('Simple operations', function()  {

	it('Load entities', function(done) {
		var  view = persist.entityView('Person');
    	view.fields(['Person_id', 'name', 'weight']).
    	filter({name: 'weight', op: '>'});

    	var  expr = {'Persist/load': view.value()},
    		 result = jsonfp.apply({weight: 150}, expr);

    	result.then(function(list) {
    		//console.log( JSON.stringify(list, null, 4) );
    		assert.equal( list.length, 3, '3 matches');
    		done();
    	}).
    	catch(function(err) {
    		console.log( err.stack );
    		done();
    	});
	});

    it('Save entities', function(done) {
        var  view = persist.entityView('Person');
        view.filter({name: 'Person_id', op: '='});

        var  option = {view: view.value(), query: {Person_id: 1}},
             expr = {'Persist/save': option},
             inData = {name: 'George'};

        jsonfp.apply(inData, expr).then(function() {
            return  jsonfp.apply({Person_id: 1}, {'Persist/load': view.value()});
        }).
        then(function(list) {
            assert.equal(list.length, 1, 'One match');
            assert.equal(list[0].name, 'George', 'Name changed to George');

            return  jsonfp.apply({name: 'Mike'}, expr);
        }).
        then(function() {
            done();
        }).
        catch(function(err) {
            console.log( err.stack );
            done();
        });
    });

	it('Save entities with input data justified', function(done) {
        var  view = persist.entityView('Person');
        view.fields(['Person_id', 'name', 'weight']).
        filter({name: 'Person_id', op: '='});

        var  option = {view: view.value(), query: {Person_id: 1}},
             expr = {'Persist/save': option},
             inData = {name: 'George'};

		jsonfp.apply(inData, expr).then(function() {
            return  jsonfp.apply({Person_id: 1}, {'Persist/load': view.value()});
        }).
        then(function(list) {
            assert.equal(list.length, 1, 'One match');
            assert.equal(list[0].name, 'George', 'Name changed to George');

            return  jsonfp.apply({name: 'Mike'}, expr);
        }).
        then(function() {
            done();
        }).
        catch(function(err) {
            console.log( err.stack );
            done();
        });
	});

    it('Insert and delete', function(done) {
        var  expr = {'Persist/add': 'Person'},
             inData = {name: 'George', dob: '1977-01-01', weight: 200};

        jsonfp.apply( inData, expr ).
        then(function(pk) {
            assert(pk.hasOwnProperty('Person_id'), 'inser failed');

            var  view = persist.entityView('Person').filter({name: 'Person_id', op: '='}),
                 qExpr = {'Persist/load': view.value()};
            return  jsonfp.apply( pk, qExpr );
        }).
        then(function(data) {
            //console.log('inserted data is\n%s', JSON.stringify(data, null, 4));
            assert.equal(data[0].name, 'George', 'name was wrong');
            assert.equal(data[0].weight, 200, 'weight should be 200');

            var  view = persist.entityView('Person').filter({name: 'Person_id', op: '='}),
                 dExpr = {'Persist/delete': view.value()};
            return  jsonfp.apply( data[0], dExpr );
        }).
        then(function() {
            done();
        }).
        catch(function(err) {
            console.log( err.stack );
            done();
        });
    });
});