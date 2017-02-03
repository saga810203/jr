;
jr.define(["jQuery"], function($) {
	var FORM_ITEM_CSS = ".form-item",
		FORM_ITEM_VALUE_CSS = ".form-item-val",
		FORM_ITEM_VALUE_CACHE_KEY = "form_item_value",
		READONLY_CSS = "readOnly",
		SHOWONLY_CSS = "showOnly",
		TRIMED_CSS = "trimed",
		DISABLED = "disabled",


	return {
		init: function(ele, obj) {
			ele.data(FORM_ITEM_VALUE_CACHE_KEY, obj);
			var tmp;
			obj.name = ele.attr("name") || ele.attr("id");
			if(!obj.name) {
				throw "Attribute[name] is invalid";
			}
			obj.readOnly = ele.hasClass(READONLY_CSS);
			obj.showOnly = ele.hasClass(SHOWONLY_CSS);
			try {
				tmp = ele.attr("dataType");
				obj.dataType = parseInt(tmp);
				if(isNan(obj.dataType)) obj.dataType = 0;
			} catch(err) {
				obj.dataType = 0;
			}
			obj.ele = ele;
		},
		returnTrue: function() {
			return true;
		},
		returnFalse: function() {
			return false;
		},
		noop: function() {},

		

	};
});