;
jr.define(["jQuery"], function($, base) {
	var Jhidden = function(ele) {
		this.name = ele.attr("name") || ele.attr("id");
		if(!this.name) {
			throw "Attribute[name] is invalid";
		}
	}
	$.extend(Jhidden.prototype, {
		val: function(val) {
			if(val) {
				this.value = val;
			} else {
				return this.value;
			}
		},
		reset: function() {
			return this.value = this.dv;
		},
		render: function(){},
		validate: function(){return true},
		setDefaultValue:function(value) {
			this.dv = value;
		},
	});
	return {
		build: function(ele) {
			return ele.hasClass("hidden") ? new Jhidden(ele) : false;
		},
	};

});