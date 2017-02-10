;
jr.define(["jQuery", "jhidden", "jtext"], function($, hidden, text) {

	var FORM_VALUE_CACHE_KEY = "form_value",
		FORM_ITEM_CREATER = [hidden, text],
		emptyString = "",
		UNDEFINE = "undefined",
		NULL = "null",
		BOOL = "boolean",
		NUM = "number",
		STR = "string",
		FUN = "function",
		ARRAY = "array",
		OBJECT = "object",

		serialize = function(obj, name, val, r) {
			var ret = r || "";
			var tn = $.type(val);
			if(tn == BOOL) {
				ret = ret + name + "=" + (val ? "1" : "0") + "&";
			} else if(tn == NUM) {
				ret = ret + name + "=" + val + "&";
			} else if(tn == STR) {
				if(val)
					ret = ret + name + "=" + encodeURIComponent(val) + "&";
			} else if(tn == FUN) {
				ret = serialize(obj, name, val.call(obj), ret)
			} else if(tn == ARRAY) {
				for(var i = 0; i < val.length; ++i) {
					ret = serialize(obj, name, val[i], ret);
				}
			} else if(tn == OBJECT) {
				ret = ret + name + "=" + encodeURIComponent(JSON.stringify(val)) + "&";
			}
			return ret;
		},

		Jform = function(ele) {
			this.items = {};
			var that = this;
			ele.find(".form_item").each(function() {
				var $this = $(this);
				for(var i = 0; i < FORM_ITEM_CREATER.length; ++i) {
					var item = FORM_ITEM_CREATER[i].build($this);
					if(item) {
						this.items[item.name] = item;
						
						return false;
					}
				}
			});
		},
		FormPlugin=function(cfg){
			if(this.length){
				var form = $(this[0]);
				var ret = form.data();
			}
		}
		
		
		;
		
		
	$.extend(Jform.prototype, {
		item: function(name) {
			return this.items[name];
		},
		render: function() {
			for(var key in this.items) {
				var val = this.items[key].render();
			}
			return this;
		},
		validate: function() {
			var ret = true;
			for(var key in this.items) {
				if(!this.items[key].validate()) return ret = false;
			}
			return ret;
		},
		reset: function() {
			for(var key in this.items) {
				this.items[key].reset();
			}
			return this;
		},
		val: function(data) {
			if(!data) {
				if(!this.validate()) return false;
				var ret = {};
				for(var key in this.items) {
					var val = this.items[key].val();
					if(val !== undefined) {
						ret[key] = val;
					}
				}
				return ret;
			}
			for(var key in data) {
				var obj = this.items[key];
				if(obj) {
					obj.val(data[key]);
				}
			}
			return this;
		},
		queryString: function() {
			if(!this.validate()) return false;
			var qs = "";
			for(var key in this.items) {
				var obj = this.items[key];
				var val = obj.val();
				qs = serialize(obj, key, val, qs);
			}
			if(qs.length > 1) {
				qs.substr(0, qs.length - 1);
			}
			return qs;
		}
	});
	return function(id) {
		var form = $(id);
		if(form.length) {
			var data = form.data(FORM_VALUE_CACHE_KEY);
			if(!data) {
				form.data(FORM_VALUE_CACHE_KEY, (data = new Jform(form)));
				data.render();
			}
			return data;
		}
	};

});