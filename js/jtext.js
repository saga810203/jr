;jr.define(["jQuery"], function($) {
	var Jtext = function(ele) {
		this.name = ele.attr("name") || ele.attr("id");
		if(!this.name) {
			throw "Attribute[name] is invalid";
		}
		this.trimed = ele.hasClass("trimed");
		this.readOnly = ele.hasClass(READONLY_CSS);
		this.showOnly = ele.hasClass(SHOWONLY_CSS);
		this.ele = ele;
		this.dv = ele.attr("defaultValue")||"";
	};

	$.extend(Jtext.prototype, {
		render: function() {
			if(this.showOnly) {
				this.ele.html("");
			} else {
				this.valEle = $("<input type='text'/>");
				var tmp = this.ele.attr("placeholder");
				if(tmp) this.valEle.attr("placeholder", tmp);
				if(this.readOnly) this.valEle.prop("readonly", "readonly");
				this.valEle.appendTo(this.ele);
			}
		},

		val: function(val) {
			if(val) {
				if(this.showOnly) {
					this.ele.html(val);
				} else {
					this.valEle.val(val);
				}
				return this;
			} else if("null" == $.type(val) || "string" == $.type(val)) {
				if(this.showOnly) {
					this.ele.html("");
				} else {
					this.valEle.val("");
				}
				return this;
			}else if(!this.showOnly) {
				var vtext = this.valEle.val();
				if(this.trimed && vtext) vtext = $.trim(vtext);
				return vtext;
			}
		},
		reset: function() {
			if(this.showOnly) {
				this.ele.html(this.dv);
			} else {
				this.valEle.val(dv);
			}
		},
		validate: function() {
			var vtext = this.valEle.val();
			if(this.trimed && vtext) vtext = $.trim(vtext);
			if(this.ele.attr("required")) {
				if(!vtext) return "required";
			}
		}
	});
	return {
		build: function(ele) {
			return ele.hasClass("text") ? new Jtext(ele) : false;
		},
	};

});