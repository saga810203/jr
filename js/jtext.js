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
		this.dt = 0;
		if(ele.hasClass("int")){
			this.dt = 1;	
		}else ele.hasClass("float"){
			this.dt = 2;
		}
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
			this.val(this.dv);
		},
		val: function(val) {
			if(arguments.length){
				var ct = (val===null?"":(""+val));
				this.showOnly?this.ele.html(ct)?this.valEle.html(ct);
			}else if(!this.isShowOnly){
				var v = this.codeEle.val();
				v = this.trimed?$.trim(v):v;
				return this.dt==0?v:(v?(this.dt==1?parseInt(v):parseFloat(v)):0);
			}
		},
		reset: function() {
			this.val(this.dv);
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