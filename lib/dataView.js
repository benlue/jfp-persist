/*!
* soar
* authors: Ben Lue
* license: MIT License
* Copyright(c) 2015 Gocharm Inc.
*/
var  dataView = (function()  {

	var  dataView = function(tableName) {
		this.schema = {};
		this.schema.table = {name: tableName};
	};

	dataView.prototype.join = function(joinExpr) {
		// do some checking
		if (!joinExpr.table)
			throw  new Error('Joined table name is missing');
		if (!joinExpr.use && !joinExpr.onWhat)
			throw  new Error('Missing join clause');

		if (!this.schema.table.join)
			this.schema.table.join = [];
		this.schema.table.join.push( joinExpr );

		return  this;
	};

	dataView.prototype.fields = function(columns)  {
		var  arrayClaz = Object.prototype.toString.call(columns).slice(8, -1);
		if (arrayClaz === 'Array')  {
			for (var i in columns)  {
				if (typeof columns[i] !== 'string')
					throw  new Error('table column should be a string or an array of strings');
			}
			this.schema.columns = columns;
		}
		else  {
			if (typeof columns !== 'string')
				throw  new Error('table column should be a string or an array of strings');

			if (!this.schema.columns)
				this.schema.columns = [];
			this.schema.columns.push( columns );
		}

		return  this;
	};

	dataView.prototype.filter = function(filter)  {
		this.schema.filters = filter;
		return  this;
	};

	dataView.prototype.extra = function(extra)  {
		this.schema.extra = extra;
		return  this;
	};

	dataView.prototype.chainFilters = function(op, filters)  {
		return  {op: op, filters: filters};
	};

	dataView.prototype.value = function()  {
		return  this.schema;
	};

	return  dataView;
})();


module.exports = dataView;